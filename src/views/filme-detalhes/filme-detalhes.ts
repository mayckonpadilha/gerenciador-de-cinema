import { Cast } from "../../models/cast";
import { Credito } from "../../models/credito";
import { HistoricoFavoritos } from "../../models/favoritos";
import { Filme } from "../../models/filme";
import { Generos } from "../../models/generos";
import { Video } from "../../models/video";
import { FilmeService } from "../../services/filme.service";
import { LocalStorageService } from "../../services/local-storage.service";
import "./filme-detalhes.css"

class DetalhesFilmes{
    filmeService: FilmeService;
    container:HTMLDivElement;
    chaveVideo:string;


    localStorageService: LocalStorageService;
    
    constructor() {
        this.localStorageService = new LocalStorageService();
        this.filmeService = new FilmeService(this.localStorageService.carregarDados());
        const url = new URLSearchParams(window.location.search);
        const nome = url.get('titulo') as string;

        this.pesquisarFilmePorTitulo(nome);

        this.registrarElementos();
        this.registrarEventos();
      
    }
    registrarElementos():void{
        this.container = document.getElementById('container') as HTMLDivElement;
    }

    registrarEventos(): void{
    }

    private pesquisarFilmePorTitulo(nome: string) : void{
        this.filmeService.selecionarFilmePorTitulo(nome)
        .then(filme => this.gerarCard(filme));
    }


    private gerarCard(filme: Filme):void{
      
        const pnlFIlme = document.createElement("div");
        let chave = "";
        this.filmeService.BuscarVideo(filme.id).then(video => 
            {
                if(video.key != null)
                    chave = `https://www.youtube.com/embed/${video.key}?si=IaFskl1A5pV1uf6Z&amp;controls=video.key`;
                else
                    chave = `https://www.youtube.com/embed/DFaVayiluIw?si=IaFskl1A5pV1uf6Z&amp;controls=video.key`;
            }
            );
        let listaDeAtores:any[] = [];
        let listaDeDiretores:any[] = [];
        let listaDeEscritores:any[] = [];

        let listageneros = this.pegarGenerosDoFilmes(filme);
        this.filmeService.selecionarCreditoDoFilme(filme).then(credito => listaDeAtores = this.pegarListaDosCreditos(credito.cast,'Acting'));
        this.filmeService.selecionarCreditoDoFilme(filme).then(credito => listaDeDiretores = this.pegarListaDosCreditos(credito.crew,'Directing'));
        this.filmeService.selecionarCreditoDoFilme(filme).then(credito => listaDeEscritores = this.pegarListaDosCreditos(credito.crew,'Writing'));
        let Iconfavorito = "bi-heart";

         
        for(let film of this.filmeService.selecionarFavoritos()){
           if(filme.title == film.title){
            Iconfavorito = "bi-heart-fill";
           }
        }      
        setTimeout(() => {
            pnlFIlme.innerHTML = `
            <div class="row">
    
                <div class="d-flex align-items-center">
                    <h1 class="text-light">${filme.title}</h1>
    
                    <div class="ms-auto text-end">
                        <p class="text-light">${filme.vote_count}</p>
                        <i class="bi ${Iconfavorito} fs-2 text-warning botao-favorito" id="botaoFavorito"></i>
                    </div>
                </div>  
                <small id="datalancamento"></small>
            </div>  
           
            <div class="row">
                <div class="col-lg-3">
                    <img 
                        src="https://image.tmdb.org/t/p/w500/${filme.poster}"
                        class="img-fluid rounded-3"
                        alt=""
                    />
                </div>
                <div class="col-lg">
                    <div class="ratio ratio-21x9 h-100">
                        <iframe
                        class="rounded-3"
                        id="iframeTrailer"
                        src="${chave}"
                        frameborder="0"
                        allowfullscreen
                        ></iframe>
                    </div> 
                </div>
            </div>
            <div class="d-flex gap-3" id="generos">

            </div>
    
            <div class="rol">
                <p class="fs-5 text-light">
                    ${filme.overview}
                </p>
            </div>

            </div>

            

            <nav class="navbar lista-creditos">
            </nav>

            <nav class="navbar lista-creditos">
            </nav>

            <nav class="navbar  lista-creditos">       
            </nav>
            `;

        setTimeout(() => {
            let divGeneros = document.getElementById("generos");
            for(let nome of listageneros){
                let spanGenero = document.createElement('span');
                spanGenero.classList.add("badge", "rounded-pill", "fs-5", "px-4", "py-2" ,"bg-warning" ,"text-dark", "gap-3");
                spanGenero.textContent = nome;
                divGeneros?.appendChild(spanGenero);
            } 
        },500);

        setTimeout(() => {
            let listasCreditos = document.getElementsByClassName("lista-creditos");
            for(let i = 0; i < 3; i++){

                if(i == 0){
                    let container = document.createElement('div');
                    container.classList.add("container");
                    container.innerHTML = `
                    <p class="text-light fs-4 fw-bold">Diretor(es):</p>`;
                    for(let diretor of listaDeDiretores){
                       let p = document.createElement('p');
                       p.classList.add("text-light","fw-bold");
                       p.innerText = ` ${diretor}, `;
                       container.appendChild(p);
                    }
                    listasCreditos[i]?.appendChild(container);
                   
                }
                if(i == 1){
                    let container = document.createElement('div');
                    container.classList.add("container");
                    container.innerHTML = `
                    <p class="text-light fs-4 fw-bold">Escritores:</p>`;
                    for(let escritor of listaDeEscritores){
                        let p = document.createElement('p');
                        p.classList.add("text-light","fw-bold");
                        p.innerText = ` ${escritor}, `;
                        container.appendChild(p);
                     }
                     listasCreditos[i]?.appendChild(container);
                }
                if(i == 2){
                    let container = document.createElement('div');
                    container.classList.add("container");
                    container.innerHTML = `
                    <p class="text-light fs-4 fw-bold">Atores:</p>`;
                    for(let ator of listaDeAtores){
                        let p = document.createElement('p');
                        p.classList.add("text-light","fw-bold");
                        p.innerText = ` ${ator}, `;
                        container.appendChild(p);
                     }
                     listasCreditos[i]?.appendChild(container);
                }
            } 
        },500);

      
        setTimeout(() => {
            let botaoFavorito = document.getElementById("botaoFavorito");
            botaoFavorito?.addEventListener('click', (e) => this.favoritarFilme(e,filme));
        },500);
           
        this.container.appendChild(pnlFIlme);
        }, 1000);
     
    }
    pegarListaDosCreditos(credito: Cast[], tipo: string): any[] {
        let list:any[] = [];

        for(let cast of credito){
            if(!list.includes(cast.name)){
                if(cast.known_for_department == tipo){
                    list.push(cast.name);
                }
            }             
        }
        console.log(list);
        return list;
    }

    private favoritarFilme(event: Event,filme:Filme): any {
        let botaoClicado = event.target as HTMLParagraphElement;
        
        if(botaoClicado.classList.contains('bi-heart')){
            botaoClicado.classList.remove('bi-heart');
            botaoClicado.classList.add('bi-heart-fill');
            this.filmeService.registrarFavorito(filme);
        }else
        if(botaoClicado.classList.contains('bi-heart-fill')){
            botaoClicado.classList.remove('bi-heart-fill');
            botaoClicado.classList.add('bi-heart');
            this.filmeService.removerFavorito(filme);
        }
        this.atualizarFavoritos();
    }

    private pegarGenerosDoFilmes(filme:Filme): string[] {
        let generos: Generos[] = this.filmeService.selecionarGeneros();

        let nomesDosgeneros:string[] = [];
        for (let genero of generos) {
            for (let generoDoFilme of filme.genres) {
                if (generoDoFilme == genero.id) {
                    nomesDosgeneros.push(genero.name);
                }
            }
        }
        return nomesDosgeneros;
    }

    private atualizarFavoritos(): void {
        this.localStorageService.salvarDados(this.filmeService.historico);
    }
}
window.addEventListener('load', () => new DetalhesFilmes());