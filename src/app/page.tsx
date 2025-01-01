"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CalculadoraInvestimentos() {
  const [tipoInvestimento, setTipoInvestimento] = useState('CDB')
  const [taxaInvestimento, setTaxaInvestimento] = useState('')
  const [valorInicial, setValorInicial] = useState('')
  const [aporteMensal, setAporteMensal] = useState('')
  const [prazo, setPrazo] = useState('')
  const [unidadePrazo, setUnidadePrazo] = useState('meses')
  const [dataInicio, setDataInicio] = useState('')
  const [reinvestirJuros, setReinvestirJuros] = useState(true)
  const [taxaSelic, setTaxaSelic] = useState<number | null>(null)
  const [taxaCDI, setTaxaCDI] = useState<number | null>(null)
  const [resultado, setResultado] = useState<number | null>(null)
  const [rendimentoBruto, setRendimentoBruto] = useState<number | null>(null)
  const [impostoRenda, setImpostoRenda] = useState<number | null>(null)
  const [aliquotaIR, setAliquotaIR] = useState<number | null>(null)
  const [explicacaoCalculo, setExplicacaoCalculo] = useState<string>('')
  const [selicManual, setSelicManual] = useState('automatico')
  const [taxaSelicManual, setTaxaSelicManual] = useState('')

  useEffect(() => {
    if (selicManual === 'automatico') {
      fetchTaxas()
    }
  }, [selicManual])

  async function fetchTaxas() {
    try {
      const response = await fetch('/api/selic')
      const data = await response.json()
      setTaxaSelic(data.selic || null)
      setTaxaCDI(data.cdi || null)
    } catch (error) {
      console.error('Erro ao obter taxas:', error)
      setTaxaSelic(null)
      setTaxaCDI(null)
    }
  }

  const calcularImpostoCDB = (rendimentoBruto: number, prazoDias: number) => {
    let aliquota;

    if (prazoDias <= 180) {
      aliquota = 22.5;
    } else if (prazoDias <= 360) {
      aliquota = 20;
    } else if (prazoDias <= 720) {
      aliquota = 17.5;
    } else {
      aliquota = 15;
    }

    return {
      imposto: rendimentoBruto * (aliquota / 100),
      aliquota: aliquota
    };
  };

  const calcularRendimento = () => {
    const valorInicialNum = parseFloat(valorInicial);
    const aporteMensalNum = parseFloat(aporteMensal) || 0;
    const taxaPercentual = parseFloat(taxaInvestimento) / 100;
    const selicAtual = selicManual === 'manual' ? parseFloat(taxaSelicManual) : (taxaSelic || 0);

    if (selicAtual === 0) {
      alert("Erro: Taxa Selic inválida. Verifique os valores.");
      return;
    }

    const cdiAtual = selicAtual * 0.9; // CDI ≈ 90% da Selic

    const taxaAnual = tipoInvestimento === 'CDB'
      ? taxaPercentual * (cdiAtual / 100)
      : taxaPercentual;

    const meses = unidadePrazo === 'anos' ? parseInt(prazo) * 12 : parseInt(prazo);
    const dias = meses * 30; // Aproximação de dias para cálculo do imposto

    if (isNaN(valorInicialNum) || isNaN(taxaAnual) || isNaN(meses)) {
      alert("Erro: Valores de entrada inválidos.");
      return;
    }

    let montante = valorInicialNum;
    let totalInvestido = valorInicialNum;
    const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;

    let explicacaoDetalhada = `Cálculo detalhado:\n\n`;
    explicacaoDetalhada += `1. Dados iniciais:\n`;
    explicacaoDetalhada += `   - Valor inicial (VI): R$ ${valorInicialNum.toFixed(2)}\n`;
    explicacaoDetalhada += `   - Aporte mensal (AM): R$ ${aporteMensalNum.toFixed(2)}\n`;
    explicacaoDetalhada += `   - Taxa Selic: ${selicAtual}%\n`;
    explicacaoDetalhada += `   - CDI: ${cdiAtual.toFixed(2)}% (90% da Selic)\n`;
    explicacaoDetalhada += `   - Taxa do investimento: ${(taxaPercentual * 100).toFixed(2)}% ${tipoInvestimento === 'CDB' ? 'do CDI' : 'ao ano'}\n`;
    explicacaoDetalhada += `   - Taxa anual efetiva (i): ${(taxaAnual * 100).toFixed(4)}%\n`;
    explicacaoDetalhada += `   - Taxa mensal (im): ${(taxaMensal * 100).toFixed(6)}%\n`;
    explicacaoDetalhada += `     Cálculo: im = (1 + i)^(1/12) - 1 = (1 + ${taxaAnual.toFixed(6)})^(1/12) - 1 = ${taxaMensal.toFixed(6)}\n`;
    explicacaoDetalhada += `   - Prazo: ${meses} meses\n\n`;
    explicacaoDetalhada += `2. Cálculo mês a mês:\n`;

    for (let i = 0; i < meses; i++) {
      const juros = montante * taxaMensal;
      const saldoAnterior = montante;
      
      if (reinvestirJuros) {
        montante *= (1 + taxaMensal);
        montante += aporteMensalNum;
      } else {
        montante += juros + aporteMensalNum;
      }
      
      totalInvestido += aporteMensalNum;

      explicacaoDetalhada += `   Mês ${i + 1}:\n`;
      explicacaoDetalhada += `   - Saldo anterior (S): R$ ${saldoAnterior.toFixed(2)}\n`;
      explicacaoDetalhada += `   - Juros (J): R$ ${juros.toFixed(2)}\n`;
      explicacaoDetalhada += `     Cálculo: J = S * im = ${saldoAnterior.toFixed(2)} * ${taxaMensal.toFixed(6)} = ${juros.toFixed(2)}\n`;
      explicacaoDetalhada += `   - Aporte: R$ ${aporteMensalNum.toFixed(2)}\n`;
      if (reinvestirJuros) {
        explicacaoDetalhada += `   - Novo saldo: R$ ${montante.toFixed(2)}\n`;
        explicacaoDetalhada += `     Cálculo: S * (1 + im) + AM = ${saldoAnterior.toFixed(2)} * (1 + ${taxaMensal.toFixed(6)}) + ${aporteMensalNum.toFixed(2)} = ${montante.toFixed(2)}\n\n`;
      } else {
        explicacaoDetalhada += `   - Novo saldo: R$ ${montante.toFixed(2)}\n`;
        explicacaoDetalhada += `     Cálculo: S + J + AM = ${saldoAnterior.toFixed(2)} + ${juros.toFixed(2)} + ${aporteMensalNum.toFixed(2)} = ${montante.toFixed(2)}\n\n`;
      }
    }

    const rendimentoBrutoCalculado = montante - totalInvestido;
    const { imposto: impostoCalculado, aliquota } = tipoInvestimento === 'CDB' 
      ? calcularImpostoCDB(rendimentoBrutoCalculado, dias)
      : { imposto: 0, aliquota: 0 };

    explicacaoDetalhada += `3. Resultado final:\n`;
    explicacaoDetalhada += `   - Total investido: R$ ${totalInvestido.toFixed(2)}\n`;
    explicacaoDetalhada += `   - Montante final: R$ ${montante.toFixed(2)}\n`;
    explicacaoDetalhada += `   - Rendimento bruto: R$ ${rendimentoBrutoCalculado.toFixed(2)}\n`;
    explicacaoDetalhada += `     Cálculo: Montante final - Total investido = ${montante.toFixed(2)} - ${totalInvestido.toFixed(2)} = ${rendimentoBrutoCalculado.toFixed(2)}\n`;
    if (tipoInvestimento === 'CDB') {
      explicacaoDetalhada += `   - Alíquota de IR: ${aliquota}%\n`;
      explicacaoDetalhada += `   - Imposto de Renda: R$ ${impostoCalculado.toFixed(2)}\n`;
      explicacaoDetalhada += `     Cálculo: Rendimento bruto * Alíquota = ${rendimentoBrutoCalculado.toFixed(2)} * ${(aliquota / 100).toFixed(4)} = ${impostoCalculado.toFixed(2)}\n`;
    }
    explicacaoDetalhada += `   - Rendimento líquido: R$ ${(rendimentoBrutoCalculado - impostoCalculado).toFixed(2)}\n`;
    explicacaoDetalhada += `     Cálculo: Rendimento bruto - Imposto de Renda = ${rendimentoBrutoCalculado.toFixed(2)} - ${impostoCalculado.toFixed(2)} = ${(rendimentoBrutoCalculado - impostoCalculado).toFixed(2)}\n`;

    setRendimentoBruto(rendimentoBrutoCalculado);
    setImpostoRenda(impostoCalculado);
    setResultado(montante - impostoCalculado);
    setAliquotaIR(aliquota);
    setExplicacaoCalculo(explicacaoDetalhada);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Calculadora de Investimentos</CardTitle>
        <CardDescription>Calcule rendimentos de CDB e Tesouro Direto</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); calcularRendimento(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoInvestimento">Tipo de Investimento</Label>
              <Select onValueChange={setTipoInvestimento} defaultValue={tipoInvestimento}>
                <SelectTrigger id="tipoInvestimento">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDB">CDB</SelectItem>
                  <SelectItem value="Tesouro Direto">Tesouro Direto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxaInvestimento">
                Taxa do Investimento ({tipoInvestimento === 'CDB' ? '% do CDI' : '% ao ano'})
              </Label>
              <Input
                id="taxaInvestimento"
                type="number"
                value={taxaInvestimento}
                onChange={(e) => setTaxaInvestimento(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorInicial">Valor Inicial (R$)</Label>
              <Input
                id="valorInicial"
                type="number"
                value={valorInicial}
                onChange={(e) => setValorInicial(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aporteMensal">Aporte Mensal (R$)</Label>
              <Input
                id="aporteMensal"
                type="number"
                value={aporteMensal}
                onChange={(e) => setAporteMensal(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazo">Prazo</Label>
              <div className="flex space-x-2">
                <Input
                  id="prazo"
                  type="number"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  required
                />
                <Select onValueChange={setUnidadePrazo} defaultValue={unidadePrazo}>
                  <SelectTrigger id="unidadePrazo">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meses">Meses</SelectItem>
                    <SelectItem value="anos">Anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início (opcional)</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex items-center">
              <Label htmlFor="reinvestirJuros" className="flex-grow">Reinvestir Juros</Label>
              <Switch
                id="reinvestirJuros"
                checked={reinvestirJuros}
                onCheckedChange={setReinvestirJuros}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Taxa Selic</Label>
              <RadioGroup defaultValue="automatico" onValueChange={setSelicManual}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="automatico" id="automatico" />
                  <Label htmlFor="automatico">Automático (Banco Central)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual">Manual</Label>
                </div>
              </RadioGroup>
            </div>
            {selicManual === 'manual' && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="taxaSelicManual">Taxa Selic Manual (%)</Label>
                <Input
                  id="taxaSelicManual"
                  type="number"
                  value={taxaSelicManual}
                  onChange={(e) => setTaxaSelicManual(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full">Calcular</Button>
        </form>

        {resultado !== null && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resultado do Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Valor Final: R$ {resultado.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                Rendimento Bruto: R$ {rendimentoBruto !== null ? rendimentoBruto.toFixed(2) : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                Imposto de Renda: R$ {impostoRenda !== null ? impostoRenda.toFixed(2) : 'N/A'}
              </p>
              {aliquotaIR !== null && aliquotaIR > 0 && (
                <p className="text-sm font-semibold my-1">
                  Alíquota de IR aplicada: 
                  <span className={`ml-2 px-1.5 py-0.5 rounded ${
                    aliquotaIR === 22.5 ? 'bg-red-500' :
                    aliquotaIR === 20 ? 'bg-orange-500' :
                    aliquotaIR === 17.5 ? 'bg-yellow-500' :
                    'bg-green-500'
                  } text-white`}>
                    {aliquotaIR}%
                  </span>
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Rendimento Líquido: R$ {(resultado - parseFloat(valorInicial)).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Taxa Selic: {selicManual === 'automatico' ? (taxaSelic !== null ? taxaSelic : 'N/A') : taxaSelicManual}% | 
                CDI: {taxaCDI !== null ? taxaCDI.toFixed(2) : 'N/A'}%
              </p>
              <div className="mt-4 p-4 bg-zinc-950 border rounded-md">
                <h3 className="font-semibold mb-2">Explicação Detalhada do Cálculo:</h3>
                <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">{explicacaoCalculo}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

