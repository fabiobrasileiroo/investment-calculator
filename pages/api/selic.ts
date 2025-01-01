import { NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
};

export default async function GET() {
  try {
    const dataAtual = new Date().toLocaleDateString('pt-BR')
    console.log("🚀 ~ GET ~ dataAtual:", dataAtual)
    const url = `https://www.bcb.gov.br/api/servico/sitebcb/bcdatasgs?tronco=estatisticas&guidLista=323626f4-c92f-46d6-bac7-55bf88f6430b&dataInicial=${dataAtual}&dataFinal=${dataAtual}&serie=432`
    
    const response = await fetch(url)
    const data = await response.json()
    
    const selic = data.conteudo[0].valor
    const cdi = selic * 0.9 // CDI ≈ 0.9 × Selic

    return NextResponse.json({ selic, cdi })
  } catch (error) {
    console.error('Erro ao obter taxa Selic:', error)
    return NextResponse.json({ error: 'Erro ao obter taxa Selic' }, { status: 500 })
  }
}

