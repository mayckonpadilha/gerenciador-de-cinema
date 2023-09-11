import { Filme } from '../../models/filme';
import { FilmeService } from '../../services/filme.service';
import { LocalStorageService } from '../../services/local-storage.service';
import './filme-listagem.css';

class Tela{

    filmesEmAlta:HTMLDivElement;
    filmesEmAltaLink:HTMLLinkElement;

    filmesTopRated:HTMLDivElement;
    filmesTopRatedLink: HTMLLinkElement;

    filmesNoCinema:HTMLDivElement;
    filmesNoCinemaLink: HTMLLinkElement;

    filmesFavoritos:HTMLDivElement;
    filmesFavoritosLink: HTMLLinkElement;

    filmesPorVir:HTMLDivElement;
    filmesPorVirLink: HTMLLinkElement;


    filmeService: FilmeService;
    localStorageService: LocalStorageService;

   

    constructor() {

        this.localStorageService = new LocalStorageService();
        this.registrarElementos();
        this.registrarEventos();
        this.filmeService = new FilmeService(this.localStorageService.carregarDados());
        this.filmesNoCinemaLink.click();
    }

    registrarElementos():void{
     
        this.filmesEmAlta = document.getElementById('filmesEmAlta') as HTMLDivElement;
        this.filmesEmAltaLink = document.getElementById('filmesEmAltaLink') as HTMLLinkElement;

        this.filmesTopRated = document.getElementById('filmesTopRated') as HTMLDivElement;
        this.filmesTopRatedLink = document.getElementById('filmesTopRatedLink') as HTMLLinkElement;

        this.filmesPorVir = document.getElementById('filmesPorVir') as HTMLDivElement;
        this.filmesPorVirLink = document.getElementById('filmesPorVirLink') as HTMLLinkElement;

        this.filmesNoCinema = document.getElementById('filmesNoCinema') as HTMLDivElement;
        this.filmesNoCinemaLink = document.getElementById('filmesNoCinemaLink') as HTMLLinkElement;

        
        this.filmesFavoritos = document.getElementById('filmesFavoritos') as HTMLDivElement;
        this.filmesFavoritosLink = document.getElementById('filmesFavoritosLink') as HTMLLinkElement;
    }

    registrarEventos(): void{
        this.filmesEmAltaLink.addEventListener('click', (e) => this.filmeService.selecionarFilmesPopulares().then(filmes => this.gerarGridFilmes(e,filmes,this.filmesEmAlta)));

        this.filmesTopRatedLink.addEventListener('click', (e) => this.filmeService.selecionarFilmesTopRated().then(filmes => this.gerarGridFilmes(e,filmes,this.filmesTopRated)));

        this.filmesPorVirLink.addEventListener('click', (e) => this.filmeService.selecionarFilmesPorVir().then(filmes => this.gerarGridFilmes(e,filmes,this.filmesPorVir)));

        this.filmesNoCinemaLink.addEventListener('click', (e) => this.filmeService.selecionarFilmesNoCinema().then(filmes => this.gerarGridFilmes(e,filmes,this.filmesNoCinema)));

        this.filmesFavoritosLink.addEventListener('click', (e) => this.gerarGridFilmes(e,this.filmeService.selecionarFavoritos(),this.filmesFavoritos));
    }

    buscar(titulo:string):void{
        this.pesquisarFilmePorTitulo(titulo);
    }

    private pesquisarFilmePorTitulo(titulo: string) : void{
        this.filmeService.selecionarFilmePorTitulo(titulo)
        .then(filme => this.redirecionarUsuario(filme.title))
        .catch((error: Error) => console.log(error));
    }

    private redirecionarUsuario(nome: string): any {
        window.location.href = `detalhes.html?titulo=${nome}`;
    }

    private gerarGridFilmes(sender: Event, filmes: Filme[],div:HTMLDivElement): any {
        let linkClicado = sender.target as HTMLLinkElement;
        let divsFilmes = document.getElementsByClassName("divFilmes");
        let titulosFilmes:HTMLCollectionOf<HTMLLinkElement> = document.getElementsByClassName("titulosPrincipais") as HTMLCollectionOf<HTMLLinkElement>;
        
        if(filmes.length == 0){
            console.log("ERRO");
            this.exibirNotificacao(new Error("Sem Filmes Encontrados"));
        }
        for(let div of divsFilmes){
            div.innerHTML = '';
        }

        for(let titulo of titulosFilmes){
            titulo.innerText = '→' + titulo.innerText.slice(1);
        }

        for(let filme of filmes){
            linkClicado.innerText = '↓' + linkClicado.innerText.slice(1);
            const card = this.obterCard(filme);
            div.appendChild(card);
        }    
    }


    private obterCard(filme: Filme) {

            const id = document.createElement("p");
            const descricaoFilme = document.createElement("p");

            id.textContent = filme.id.toString();
            descricaoFilme.textContent = filme.overview;


            const cardFilme = document.createElement('div');
            cardFilme.classList.add('col-6','col-md-4', 'col-lg-2');

            cardFilme.addEventListener('click',() => this.buscar(filme.title))

            cardFilme.innerHTML = `
                <div class="d-grid gap-2 text-center">
                <img
                    src="https://image.tmdb.org/t/p/w500/${filme.poster}"
                    class="img-fluid rounded-3"/>
                    <a href="" class="fs-5 link-warning text-decoration-none">${filme.title}</a>
                </div>
            `;

            return cardFilme;
    }

    private exibirNotificacao(error: Error): void{
        const notificacao = document.createElement('div');

        notificacao.textContent = error.message;
        notificacao.classList.add('notificacao');

        notificacao.addEventListener('click', (sender: Event) =>{(sender.target as HTMLElement).remove()})

        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.remove();
        }, 3000);

    }


}
window.addEventListener('load', () => new Tela());