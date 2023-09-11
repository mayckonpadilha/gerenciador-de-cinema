import { HistoricoFavoritos } from "../models/favoritos";

export class LocalStorageService {
  private endereco: string = 'favoritos-ts:historico@1.0.0';

  salvarDados(dados: HistoricoFavoritos): void {
    const jsonString = JSON.stringify(dados);

    localStorage.setItem(this.endereco, jsonString);
  }

  carregarDados(): HistoricoFavoritos {
    const dadosJson = localStorage.getItem(this.endereco);

    if (dadosJson)
      return JSON.parse(dadosJson) as HistoricoFavoritos;

    return new HistoricoFavoritos();
  }
}