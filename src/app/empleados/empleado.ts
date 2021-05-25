import { Oficina } from '../oficinas/oficina';

export class Empleado {
  id: number;
  dni: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  createAt: Date;
  email: string;
  foto: string;
  oficina!: Oficina;

}
