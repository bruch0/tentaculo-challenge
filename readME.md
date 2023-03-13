# Tentáculo Challenge

## Repositório criado para resolução do case para a vaga de desenvolvedor Backend na Tentáculo

## Explicando o case

    Com um input de dados por arquivo .txt, é definido o tamanho da malha de planalto, a posição inicial da sonda e os movimentos que ela vai seguir.

    A primeira linha da entrada de dados é a coordenada do ponto superior-direito da malha, sendo o ponto inferior-esquerdo (0,0).

    A partir disso, as restantes linhas serão agrudapadas de duas em duas, sendo a primeira a posição initial da sonda na malha e a segunda as instruções de movimentos.

    A saída é uma linha para cada sonda, indicando sua posição e direção final.

## Exemplos de Entrada e Saída

    Entrada:
        5 5
        1 2 N
        LMLMLMLMM
        3 3 E
        MMRMMRMRRM

    Saída:
        1 3 N
        5 1 E

## Como rodar na sua máquina

### Clone o repositório

```bash
git clone https://github.com/bruch0/tentaculo-challenge.git
```

### Acesse o projeto pelo terminal

```bash
cd tentaculo-challenge
```

### Abra na sua IDE favorita

```bash
code .
```

### Instale as dependências

```bash
npm i
```

### Use a linha de comando para rodar os scripts

```bash
npm run bootstrap -> Roda o código com o arquivo de texto que criei

npm run watch -> Roda o código com o arquivo de texto que criei, roda de novo a cada alteração no arquivo data.txt

npm run test:coverage -> Roda os testes, gerando a cobertura com o Jest
```
