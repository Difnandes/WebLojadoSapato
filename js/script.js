document.addEventListener('DOMContentLoaded', function() {
  const btnVerProdutos = document.querySelector('#btn-ver-produtos');
  const btnConcluirCompra = document.querySelector('#btn-concluir-compra');
  const produtosAdicionadosContainer = document.querySelector('#produtos-adicionados');

  btnVerProdutos.addEventListener('click', function(event) {
    event.preventDefault();
    carregarProdutos();
  });

  btnConcluirCompra.addEventListener('click', function() {
    concluirCompra();
  });

  function mostrarCarrinho() {
    const secaoProdutos = document.querySelector('#produtos');
    const secaoCarrinho = document.querySelector('#carrinho');

    secaoProdutos.style.display = 'none';
    secaoCarrinho.style.display = 'block';
  }

  function carregarProdutos() {
    const produtosContainer = document.querySelector('#produtos-container');
    const produtos = [
      { nome: 'Sapato 1', preco: 1111, imagem: 'imagem/4.jpeg', descricao: 'Descrição do Sapato 1.' },
      { nome: 'Sapato 2', preco: 2222, imagem: 'imagem/icon.jpg', descricao: 'Descrição do Sapato 2.' }
      // Adicione mais produtos aqui
    ];

    produtosContainer.innerHTML = '';

    produtos.forEach((produto) => {
      const novoProduto = criarElementoProduto(produto);
      produtosContainer.appendChild(novoProduto);
    });
  }

  function criarElementoProduto(produto) {
    const novoProduto = document.createElement('div');
    novoProduto.classList.add('col-md-4', 'mb-4');
    novoProduto.innerHTML = `
      <div class="card">
        <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
        <div class="card-body">
          <h5 class="card-title">${produto.nome}</h5>
          <p class="card-text">${produto.descricao}</p>
          <p class="card-text">R$ ${produto.preco}</p>
          <a href="#" class="btn btn-primary btn-adicionar-carrinho">Adicionar ao carrinho</a>
        </div>
      </div>
    `;

    novoProduto.querySelector('.btn-adicionar-carrinho').addEventListener('click', function() {
      adicionarProdutoAoCarrinho(produto.nome, produto.preco);
    });

    return novoProduto;
  }

  function adicionarProdutoAoCarrinho(nome, preco) {
    const novoProduto = document.createElement('li');
    novoProduto.textContent = `${nome} - R$ ${preco}`;
    produtosAdicionadosContainer.appendChild(novoProduto);
    atualizarTotalCarrinho();
  }

  function atualizarTotalCarrinho() {
    const totalCarrinho = document.querySelector('#total-carrinho');
    const produtosAdicionados = produtosAdicionadosContainer.getElementsByTagName('li');
    let novoTotal = 0;

    for (let i = 0; i < produtosAdicionados.length; i++) {
      const preco = parseFloat(produtosAdicionados[i].textContent.split(' - ')[1].replace('R$ ', '').trim());

      if (!isNaN(preco)) {
        novoTotal += preco;
      }
    }

    totalCarrinho.textContent = novoTotal.toFixed(2);
  }

  function concluirCompra() {
    const carrinhoVazio = produtosAdicionadosContainer.childElementCount === 0;

    if (carrinhoVazio) {
      alert('O carrinho está vazio. Adicione produtos antes de concluir a compra.');
    } else {
      const totalCarrinho = document.querySelector('#total-carrinho');
      const total = parseFloat(totalCarrinho.textContent.trim());

      if (!isNaN(total)) {
        alert(`Compra concluída. Total: R$ ${total.toFixed(2)}`);
        limparCarrinho();
      } else {
        alert('Ocorreu um erro ao processar o total do carrinho.');
      }
    }
  }

  function limparCarrinho() {
    produtosAdicionadosContainer.innerHTML = '';
    document.querySelector('#total-carrinho').textContent = '0.00';
  }

  // Adicionar um ouvinte de evento para os itens da lista de produtos adicionados
  produtosAdicionadosContainer.addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'LI') {
      // Chamar a função para excluir o item do carrinho
      excluirItemCarrinho(event.target);
    }
  });

  // Função para excluir um item do carrinho
  function excluirItemCarrinho(item) {
    const nomeProduto = item.textContent.split(' - ')[0];
    const precoProduto = parseFloat(item.textContent.split(' - ')[1].replace('R$ ', '').trim());

    // Remover o item do carrinho
    item.remove();

    // Atualizar o total do carrinho
    const totalCarrinho = document.querySelector('#total-carrinho');
    const totalAtual = parseFloat(totalCarrinho.textContent.trim());

    if (!isNaN(totalAtual) && !isNaN(precoProduto)) {
      const novoTotal = totalAtual - precoProduto;
      totalCarrinho.textContent = novoTotal.toFixed(2);
    }

    // Atualizar o armazenamento local do carrinho
    const produtosAdicionados = produtosAdicionadosContainer.innerHTML;
    localStorage.setItem('produtosAdicionados', produtosAdicionados);
    localStorage.setItem('totalCarrinho', totalCarrinho.textContent);
  }
});
