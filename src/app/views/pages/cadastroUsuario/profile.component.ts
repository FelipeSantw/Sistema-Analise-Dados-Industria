import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DefaultHeaderComponent } from '../../../layout/default-layout/default-header/default-header.component';
import { NgStyle } from '@angular/common';

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
    DefaultHeaderComponent,
    ColDirective,
    NgStyle,
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
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ProfileComponent {

  constructor() { }

}
