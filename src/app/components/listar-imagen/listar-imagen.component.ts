import { Subscription } from 'rxjs';
import { ImagenService } from 'src/app/services/imagen.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar-imagen',
  templateUrl: './listar-imagen.component.html',
  styleUrls: ['./listar-imagen.component.css'],
})
export class ListarImagenComponent implements OnInit {
  termino = '';
  suscription: Subscription;
  listImagenes: any[] = [];
  loading: boolean = false;
  imagenesPorPagina = 30;
  PaginaActual = 1;
  calcularTotalPaginas = 0;

  constructor(private _imagenService: ImagenService) {
    this.suscription = this._imagenService
      .getTerminoBusqueda()
      .subscribe((data) => {
        this.termino = data;
        this.PaginaActual=1;
        this.loading = true;
        this.obtenerImagenes();
      });
  }

  ngOnInit(): void {}

  obtenerImagenes() {
    this._imagenService.getImagenes(this.termino, this.imagenesPorPagina, this.PaginaActual).subscribe(
      (data) => {
        this.loading = false;
        if (data.hits.length === 0) {
          this._imagenService.setError('Opss.. no encontramos resultados');
          return;
        }
        this.calcularTotalPaginas = Math.ceil(
          data.totalHits / this.imagenesPorPagina
        );

        this.listImagenes = data.hits;
      },
      (error) => {
        this._imagenService.setError('Opss.. ocurrio un error');
        this.loading = false;
        return;
      }
    );
  }

  paginaAnterior(){
    this.PaginaActual--;
    this.loading=true;
    this.listImagenes=[];
    this.obtenerImagenes();
  }
  paginaPosterior(){
    this.PaginaActual++;
    this.loading=true;
    this.listImagenes=[];
    this.obtenerImagenes();
  }
  paginaAnteriorClass(){
    if (this.PaginaActual==1) {
      return false;
    }else{
      return true;
    }
  }
  paginaPosteriorClass(){
    if (this.PaginaActual==this.calcularTotalPaginas) {
      return false;
    }else{
      return true;
    }
  }
}
