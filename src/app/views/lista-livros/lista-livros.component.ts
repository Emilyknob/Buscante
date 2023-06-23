import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { switchMap, map, filter, debounceTime, distinctUntilChanged, catchError, throwError, EMPTY } from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  totalDeLivros: LivrosResultado;

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime((PAUSA)),
      filter((valorDigitado) => valorDigitado.length >= 3),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => this.totalDeLivros = resultado),
      map(resultado => resultado.items ?? []),
      map((items) => this.livrosResultadoParaLivros(items)),
      catchError(() => {
        this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a página!';
        return EMPTY
      }),
    );
  
    livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
      return items.map(item => {
      return new LivroVolumeInfo(item)
    });
  }
}



