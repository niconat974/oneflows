import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <h2>Connexion</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input type="text" id="username" formControlName="username">
          <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid" class="error-message">
            Le nom d'utilisateur est requis
          </div>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" formControlName="password">
          <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="error-message">
            Le mot de passe est requis
          </div>
        </div>
        <button type="submit" [disabled]="loginForm.invalid || isLoading">
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      margin-top: 0.25rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:disabled {
      background-color: #ccc;
    }
    .error-message {
      color: red;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      this.authService.login(
        this.loginForm.get('username')?.value,
        this.loginForm.get('password')?.value
      ).subscribe({
        next: () => {
          this.router.navigate(['/notes']);
        },
        error: error => {
          this.error = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
          this.isLoading = false;
          console.error('Erreur de connexion:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}