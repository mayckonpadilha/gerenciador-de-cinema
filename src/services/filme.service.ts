import { API_KEY } from "../../secrets";
import { Credito } from "../models/credito";
import { HistoricoFavoritos } from "../models/favoritos";
import { Filme } from "../models/filme";
import { Generos } from "../models/generos";
import { Video } from "../models/video";

export class FilmeService{

    private _historico: HistoricoFavoritos;
  
    get historico(): HistoricoFavoritos {
      return this._historico;
    }
  
    set historico(novo: HistoricoFavoritos) {
      this._historico = novo;
    }

    constructor(historico: HistoricoFavoritos) { 
        this._historico = historico;
    }
    
    BuscarVideo(id: number) {
        const url = `https://api.themoviedb.org/3/movie/${id}/videos`;

         return fetch(url,this.ObterHeaderDeAutorizacao())
         .then((res: Response): Promise<any> => this.processarResposta(res))
         .then((obj: any): Video => this.mapearVideo(obj.results))
    }

    registrarFavorito(filme:Filme): void {
        this._historico.filmes.push(filme);
    }
    
    removerFavorito(filme:Filme): void {   
        for(let film of this.selecionarFavoritos()){
          if(filme.title == film.title){
            console.log(this.selecionarFavoritos().indexOf(film));
            this._historico.filmes.splice(this.selecionarFavoritos().indexOf(film),1);
          }
        }
    }

    selecionarFilmePorTitulo(titulo:string): Promise<Filme>{
         const url = `https://api.themoviedb.org/3/search/movie?query=${titulo}&include_adult=false&language=pt-BR&page=1`;

         return fetch(url,this.ObterHeaderDeAutorizacao())
         .then((res: Response): Promise<any> => this.processarResposta(res))
         .then((obj: any): Filme => this.mapearFilme(obj.results))
    } 

    selecionarCreditoDoFilme(filme:Filme): Promise<Credito>{
      const url = `https://api.themoviedb.org/3/movie/${filme.id}/credits?language=pt-BR`;

      return fetch(url, this.ObterHeaderDeAutorizacao())
      .then(response => this.processarResposta(response))
      .then(response => this.mapearCredito(response));
    }  

    selecionarGeneros(): any[]{
        
        return[
              {
                "id": 28,
                "name": "Ação"
              },
              {
                "id": 12,
                "name": "Aventura"
              },
              {
                "id": 16,
                "name": "Animação"
              },
              {
                "id": 35,
                "name": "Comédia"
              },
              {
                "id": 80,
                "name": "Crime"
              },
              {
                "id": 99,
                "name": "Documentário"
              },
              {
                "id": 18,
                "name": "Drama"
              },
              {
                "id": 10751,
                "name": "Família"
              },
              {
                "id": 14,
                "name": "Fantasia"
              },
              {
                "id": 36,
                "name": "História"
              },
              {
                "id": 27,
                "name": "Terror"
              },
              {
                "id": 10402,
                "name": "Música"
              },
              {
                "id": 9648,
                "name": "Mistério"
              },
              {
                "id": 10749,
                "name": "Romance"
              },
              {
                "id": 878,
                "name": "Ficção científica"
              },
              {
                "id": 10770,
                "name": "Cinema TV"
              },
              {
                "id": 53,
                "name": "Thriller"
              },
              {
                "id": 10752,
                "name": "Guerra"
              },
              {
                "id": 37,
                "name": "Faroeste"
              }
        ]
    }

    selecionarFilmesPopulares(): Promise<Filme[]>{
        const url = `https://api.themoviedb.org/3/movie/popular?language=pt-BR`;

        return fetch(url,this.ObterHeaderDeAutorizacao())
        .then((res) => this.processarResposta(res))
        .then((obj) => this.mapearListaFilme(obj.results));
    }

    selecionarFilmesTopRated(): Promise<Filme[]>{
        const url = `https://api.themoviedb.org/3/movie/top_rated?language=pt-BR`;

        return fetch(url,this.ObterHeaderDeAutorizacao())
        .then((res) => this.processarResposta(res))
        .then((obj) => this.mapearListaFilme(obj.results));
    }

    selecionarFilmesPorVir(): Promise<Filme[]>{
        const url = `https://api.themoviedb.org/3/movie/upcoming?language=pt-BR`;

        return fetch(url,this.ObterHeaderDeAutorizacao())
        .then((res) => this.processarResposta(res))
        .then((obj) => this.mapearListaFilme(obj.results));
    }

    selecionarFilmesNoCinema(): Promise<Filme[]>{
        const url = `https://api.themoviedb.org/3/movie/now_playing?language=pt-BR`;

        return fetch(url,this.ObterHeaderDeAutorizacao())
        .then((res) => this.processarResposta(res))
        .then((obj) => this.mapearListaFilme(obj.results));
    }

    selecionarFavoritos(): Filme[]{
       return this.historico.filmes;
    }

    private processarResposta(res: Response): Promise<any>{
        if(res.ok)
            return res.json();

        throw new Error('Filme nao encontrado');
        
    }

    private mapearVideo(obj: any): Video{
        try{
            let m = {
                key: obj[0].key
            };
            return m;
        }catch(Error){
            console.log(Error);
        }
        return new Video();
    }


    private mapearFilme(obj: any): Filme{  
        let m = {
            id: obj[0].id,
            title:obj[0].title,
            overview:obj[0].overview,
            video: obj[0].video,
            poster: obj[0].poster_path,
            vote_count: obj[0].vote_count,
            genres: obj[0].genre_ids
        };
        return m;
    }

    private mapearCredito(obj: any): Credito{  
      let m = {
          cast: obj.cast,
          crew: obj.crew
      };
      return m;
  }

    private mapearListaFilme(objs: any[]):Promise<Filme[]>{
       
        const listaDeFilme = objs.map(obj =>{
           return this.selecionarFilmePorTitulo(obj.title)
        });

       
        return Promise.all(listaDeFilme);
    }

   

    private ObterHeaderDeAutorizacao(){
        return {
            method:'GET',
            headers:{
                accept:'application/json',
                Authorization: `Bearer ${API_KEY}`
            }
        }
    }
}