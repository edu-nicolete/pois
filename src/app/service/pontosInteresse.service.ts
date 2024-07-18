import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PontosInteresseService {

  baseUrl: String = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar) { }

  buscaPosicaoPlacas(): Observable<any> {
    const url = this.baseUrl+'/posicao/placas';
    return this.http.get<any>(url);
  }

  buscaTodasPosicao(): Observable<any> {
    const url = this.baseUrl+'/posicao/';
    return this.http.get<any>(url);
  }

  buscaPosicaoPorPlaca(placa: String, data: any): Observable<any> {
    const url = this.baseUrl+'/posicao'+this.montaEntrada(placa, data);
    return this.http.get<any>(url);
  }

  montaEntrada(placa: String, data: String): String {
    let param = new String();

    if (placa != '') {
      if (param.length > 0) {
        param = param+'&placa='+placa
      } else {
        param = '?placa='+placa;
      }
    }

    if (data != null) {
      if (param.length > 0) {
        param = param+'&data='+data
      } else {
        param = '?data='+data;
      }
    }

    return param;
  }

  buscaPoi(): Observable<any> {
    const url = this.baseUrl+'/pois';
    return this.http.get<any>(url);
  }
}
