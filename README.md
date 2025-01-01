![Calculadora Image](https://github.com/user-attachments/assets/81fbadd4-6598-4e84-a1a5-85a4ac415ab6)
# **Calculadora de Investimentos**

Este projeto é uma **Calculadora de Investimentos** projetada para simular rendimentos de investimentos em **CDB** e **Tesouro Direto**, com base em taxas e prazos configuráveis. A calculadora considera fatores como taxa Selic, percentual do CDI prometido pelo banco, aportes mensais e impostos de renda aplicáveis.

---

## **Entendendo os Cálculos**

A calculadora realiza os cálculos de maneira precisa, explicando cada etapa para que o usuário compreenda como o rendimento é obtido:

### **Por que o CDI é 90% da Selic?**
O **CDI (Certificado de Depósito Interbancário)** é calculado com base na taxa Selic, mas geralmente é aproximadamente **90% da Selic diária efetiva**. Isso ocorre porque o CDI reflete as operações interbancárias de curto prazo, enquanto a Selic é a taxa de política monetária.

Por exemplo:
- **Taxa Selic atual (anual):** 12,25%.
- **CDI estimado:** \( \text{CDI} \approx 12,25\% \times 0,9 = 11,03\% \).

### **O que significa 110% do CDI?**
Quando o banco promete "110% do CDI", ele garante um rendimento **10% superior ao CDI padrão**. Isso significa que a taxa efetiva do investimento será:

\[
\text{Taxa Efetiva} = \text{CDI} \times 1,1
\]

No exemplo:
- CDI = 11,03%.
- Taxa final = \( 11,03\% \times 1,1 = 12,133\% \text{ ao ano.} \)

### **Fluxo dos Cálculos**
O cálculo segue o fluxo:
1. **Selic → CDI**: O CDI é estimado como 90% da Selic.
2. **CDI → Taxa do Investimento**: O percentual prometido pelo banco é aplicado ao CDI para determinar a taxa do investimento.
3. **Rendimento Final**: A taxa efetiva é usada para calcular os rendimentos considerando aportes mensais, prazos e impostos.

---

## **Funcionalidades**
- **Tipos de Investimento:** Simulação de CDBs e Tesouro Direto.
- **Aportes Mensais:** Personalização de valores iniciais e aportes periódicos.
- **Prazo Flexível:** Configuração de períodos em meses ou anos.
- **Cálculo Automático de CDI:** Taxa Selic atual obtida automaticamente ou ajustada manualmente.
- **Detalhamento dos Resultados:** O sistema exibe uma explicação passo a passo dos cálculos realizados.

---

## **Tecnologias Utilizadas**
- **Frontend:** Interface intuitiva para configuração dos cálculos.
- **Backend:** Lógica de cálculos detalhados.
- **API Selic:** Integração para obter a taxa Selic atual automaticamente.

---

## **Como Usar**
1. Configure os parâmetros na interface:
   - Tipo de investimento, valor inicial, aportes mensais, prazo e taxa Selic.
2. Clique em "Calcular".
3. Veja o resultado detalhado, incluindo:
   - Valor final bruto e líquido.
   - Imposto de renda aplicado.
   - Explicação detalhada dos cálculos.

---

Este projeto foi criado para facilitar a simulação de rendimentos financeiros, ajudando usuários a tomarem decisões de investimento com mais clareza. Se você tiver dúvidas ou sugestões, entre em contato ou abra uma pull request ;)
