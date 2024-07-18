import { OnInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PontosInteresseService } from '../../../service/pontosInteresse.service';
import { Posicoes } from '../../../models/posicoes';
import { Pois } from '../../../models/pois';

@Component({
  selector: 'app-pontos',
  templateUrl: './pontosInteresse.component.html',
  styleUrls: ['./pontosInteresse.component.css']
})
export class PontosInteresseComponent implements OnInit {

    posicoes: Posicoes[] = [];
    pois: Pois[] = [];
    posicaoCopy: Posicoes[] = [];

    displayedColumns: string[] = ['placa', 'data', 'velocidade', 'ignicao'];
    dataSource = new MatTableDataSource<any>([]);
    readonly dialog = inject(MatDialog);
    placasDisponiveis: any;
    placa: String = '';
    data: any = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private pontosInteresseService: PontosInteresseService){}

    ngOnInit(): void {
        this.buscarPosicaoPlacas();
        this.buscarTodasPosicao();
    }

    buscarPosicaoPlacas():void {
        this.pontosInteresseService.buscaPosicaoPlacas().subscribe((resposta) => {
            console.log(resposta);
            this.placasDisponiveis = resposta;
        })
    }

    buscarTodasPosicao():void {
        this.posicoes = [];
        this.pontosInteresseService.buscaTodasPosicao().subscribe((resposta) => {
            console.log(resposta);
            this.posicoes = resposta;
            this.dataSource = new MatTableDataSource<Posicoes>([]);
            if (this.posicoes.length > 0) {
                this.buscarPoi();
            }
        })
    }

    buscaPosicaoPorPlaca():void {
        if (this.placa == 'todos') {
            this.buscarTodasPosicao();
        } else {
            let dataFormatada;
            console.log('this.data', this.data);
            if (this.data) {
                let mes;
                if (this.data.getMonth() >= 10) {
                    mes = this.data.getMonth()+1;
                } else {
                    mes = '0'+(this.data.getMonth() + 1);
                }
                dataFormatada = mes+"/"+this.data.getDate()+"/"+this.data.getFullYear();
                console.log('dataFormatada', dataFormatada);
            }
            this.posicoes = [];
            this.pontosInteresseService.buscaPosicaoPorPlaca(this.placa, dataFormatada).subscribe((resposta) => {
                console.log(resposta);
                this.posicoes = resposta;
                this.dataSource = new MatTableDataSource<Posicoes>([]);
                if (this.posicoes.length > 0) {
                    this.buscarPoi();
                }
            })
        }
    }

    buscarPoi(): void {
        this.pois = [];
        this.pontosInteresseService.buscaPoi().subscribe((resposta) => {
            console.log(resposta);
            this.pois = resposta;
            this.validaLocalizacao();
        })
    }

    validaLocalizacao(): void {
        if (this.posicoes.length > 0 && this.pois.length > 0) {
            this.posicaoCopy = [];
            for (var posicao of this.posicoes) {
                for (var poi of this.pois) {
                    let latitudePosicao = posicao.latitude.toString().substr(0, 5);
                    let longitudePosicao = posicao.longitude.toString().substr(0, 5);
                    let latitudePoi = poi.latitude.toString().substr(0, 5);
                    let longitudePoi = poi.longitude.toString().substr(0, 5);
                    if (latitudePosicao == latitudePoi && longitudePosicao == longitudePoi) {
                        console.log("achou");
                        this.posicaoCopy.push(posicao);
                        break;
                    }
                }
            }

            console.log('this.posicaoCopy', this.posicaoCopy);

            this.dataSource = new MatTableDataSource<Posicoes>(this.posicaoCopy);
            this.dataSource.paginator = this.paginator;
        }
    }

    abreMapa(row: any): void {
        window.open("http://maps.google.com/maps?q="+row.latitude+","+row.longitude, "_blank");
    }
}

