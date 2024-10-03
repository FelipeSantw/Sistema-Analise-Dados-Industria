import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { 
  ColDirective,
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
} from '@coreui/angular';

@Component({
  selector: 'app-cadastroUsuario',
  templateUrl: './cadastroUsuario.component.html',
  styleUrls: ['./cadastroUsuario.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent, 
    RowComponent, 
    ColComponent, 
    TextColorDirective, 
    CardComponent, 
    CardBodyComponent, 
    FormDirective, 
    InputGroupComponent, 
    InputGroupTextDirective, 
    IconDirective, 
    FormControlDirective, 
    ButtonDirective,
    ReactiveFormsModule
  ]
})
export class CadastroUsuarioComponent implements OnInit {
  cadastroForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Inicializando o formulário com os campos e validações
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required],
    });
  }

  // Adicione o método onSubmit
  onSubmit(): void {
    if (this.cadastroForm.valid) {
      const formData = this.cadastroForm.value;

      // Enviar os dados ao endpoint
      this.http.post('https://seu-endpoint.com/api/cadastro', formData).subscribe(
        response => {
          console.log('Conta criada com sucesso!', response);
        },
        error => {
          console.error('Erro ao criar conta', error);
        }
      );
    } else {
      console.error('Formulário inválido');
    }
  }
}
