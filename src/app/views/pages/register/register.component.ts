import { Component, OnInit } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.services'; // Serviço de autenticação
import { Router } from '@angular/router'; // Serviço de roteamento
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService], // Injetar AuthService aqui, se necessário
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule, // Módulo necessário para formulários reativos
    IconDirective, 
    ContainerComponent, 
    RowComponent, 
    ColComponent, 
    TextColorDirective, 
    CardComponent, 
    CardBodyComponent, 
    FormDirective, 
    InputGroupComponent, 
    InputGroupTextDirective, 
    FormControlDirective, 
    ButtonDirective
  ]
})
export class RegisterComponent implements OnInit {
  registryForm: FormGroup = this.fb.group({}); // Corrige o nome do formulário para registryForm

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Definindo as validações para o formulário
    this.registryForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      sexo: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registryForm.valid) {
      const formData = this.registryForm.value; // Pegando os valores do formulário

      this.http.post('URL_DA_API', formData).subscribe(
        response => {
          console.log('Registro realizado com sucesso!', response);
          // Você pode redirecionar após o sucesso, por exemplo:
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Erro ao registrar o usuário', error);
        }
      );
    } else {
      console.log('O formulário é inválido');
    }
  }
}
