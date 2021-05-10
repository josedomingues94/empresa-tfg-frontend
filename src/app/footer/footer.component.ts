import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  public autor: any = { mensaje:"EmpresaApp. Todos los derechos reservados", nombre:"Jose Domingues"};


}
