import { Component } from '@angular/core';
import { DefaultHeaderComponent } from 'src/app/layout/default-layout/default-header/default-header.component'; // Ajuste o caminho conforme necessário
import { CardModule } from '@coreui/angular'; // Certifique-se de que está importando o módulo correto
import { ContainerComponent } from '@coreui/angular'; // Certifique-se de que está importando o módulo correto

@Component({
  selector: 'app-profile', // O seletor do seu novo componente
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [DefaultHeaderComponent, CardModule, ContainerComponent] // Adicione CardModule aqui
})
export class ProfileComponent {
  // Lógica do seu componente
}