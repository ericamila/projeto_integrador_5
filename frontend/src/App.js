import React, { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:5000/api';

const Icon = ({ path}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const Header = ({ setPage }) => (
  <header>
    <div>
      <div>
        <div>
          <h1>Gestão de Estoque</h1>
        </div>
        <nav>
          <button onClick={() => setPage('fornecedores')}>Fornecedores</button>
          <button onClick={() => setPage('produtos')}>Produtos</button>
          <button onClick={() => setPage('associacao')}>Associação</button>
        </nav>
      </div>
    </div>
  </header>
);

// página de Forenecedores
const FornecedoresPage = ({ fornecedores, reloadData }) => {
  const [formState, setFormState] = useState({ nome: '', cnpj: '', endereco: '', telefone: '', email: '', contato: '' });
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formState.nome) newErrors.nome = 'Nome da empresa é obrigatório.';
    if (!formState.cnpj) newErrors.cnpj = 'CNPJ é obrigatório.';
    if (!formState.endereco) newErrors.endereco = 'Endereço é obrigatório.';
    if (!formState.telefone) newErrors.telefone = 'Telefone é obrigatório.';
    if (!formState.email) newErrors.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(formState.email)) newErrors.email = 'E-mail inválido.';
    if (!formState.contato) newErrors.contato = 'Contato principal é obrigatório.';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${API_URL}/fornecedores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        });

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            setErrors({ cnpj: result.error });
          } else {
            throw new Error(result.error || 'Falha ao cadastrar fornecedor.');
          }
        } else {
          alert(result.message);
          setFormState({ nome: '', cnpj: '', endereco: '', telefone: '', email: '', contato: '' });
          setShowForm(false);
          reloadData(); 
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div >
      <div >
        <h2>Cadastro de Fornecedores</h2>
        <button onClick={() => setShowForm(!showForm)} >
          <Icon path={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4.5v15m7.5-7.5h-15"}  />
          {showForm ? 'Cancelar' : 'Novo Fornecedor'}
        </button>
      </div>

      {showForm && (
        <div >
          <form onSubmit={handleSubmit} >
            <div>
              <label >Nome da Empresa</label>
              <input type="text" name="nome" value={formState.nome} onChange={handleChange} placeholder="Insira o nome da empresa" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nome ? 'border-red-500' : ''}`} />
              {errors.nome && <p >{errors.nome}</p>}
            </div>
            <div>
              <label >CNPJ</label>
              <input type="text" name="cnpj" value={formState.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.cnpj ? 'border-red-500' : ''}`} />
              {errors.cnpj && <p >{errors.cnpj}</p>}
            </div>
            <div >
              <label >Endereço</label>
              <input type="text" name="endereco" value={formState.endereco} onChange={handleChange} placeholder="Insira o endereço completo da empresa" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.endereco ? 'border-red-500' : ''}`} />
              {errors.endereco && <p >{errors.endereco}</p>}
            </div>
            <div>
              <label >Telefone</label>
              <input type="text" name="telefone" value={formState.telefone} onChange={handleChange} placeholder="(00) 00000-0000" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.telefone ? 'border-red-500' : ''}`} />
              {errors.telefone && <p >{errors.telefone}</p>}
            </div>
            <div>
              <label >E-mail</label>
              <input type="email" name="email" value={formState.email} onChange={handleChange} placeholder="exemplo@fornecedor.com" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`} />
              {errors.email && <p >{errors.email}</p>}
            </div>
            <div >
              <label >Contato Principal</label>
              <input type="text" name="contato" value={formState.contato} onChange={handleChange} placeholder="Nome do contato principal" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.contato ? 'border-red-500' : ''}`} />
              {errors.contato && <p >{errors.contato}</p>}
            </div>
            <div >
              <button type="submit" >Cadastrar</button>
            </div>
          </form>
        </div>
      )}

      <div >
        <h2 >Fornecedores Cadastrados</h2>
        <div >
          <table >
            <thead >
              <tr>
                <th >Empresa</th>
                <th >CNPJ</th>
                <th >Contato</th>
                <th >Email</th>
              </tr>
            </thead>
            <tbody >
              {fornecedores.map(f => (
                <tr key={f.id}>
                  <td >{f.nome}</td>
                  <td >{f.cnpj}</td>
                  <td >{f.contato}</td>
                  <td >{f.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// página de Produtos
const ProdutosPage = ({ produtos, reloadData }) => {
  const [formState, setFormState] = useState({ nome: '', codigoBarras: '', descricao: '', quantidade: '', categoria: 'Eletrônicos', dataValidade: '', imagem: '' });
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formState.nome) newErrors.nome = 'Nome do produto é obrigatório.';
    if (!formState.codigoBarras) newErrors.codigoBarras = 'Código de barras é obrigatório.';
    if (!formState.descricao) newErrors.descricao = 'Descrição é obrigatória.';
    if (!formState.quantidade || formState.quantidade < 0) newErrors.quantidade = 'Quantidade inválida.';
    if (!formState.categoria) newErrors.categoria = 'Categoria é obrigatória.';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormState({ ...formState, imagem: event.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${API_URL}/produtos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        });

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            setErrors({ codigoBarras: result.error });
          } else {
            throw new Error(result.error || 'Falha ao cadastrar produto.');
          }
        } else {
          alert(result.message);
          setFormState({ nome: '', codigoBarras: '', descricao: '', quantidade: '', categoria: 'Eletrônicos', dataValidade: '', imagem: '' });
          setShowForm(false);
          reloadData();
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div >
      <div >
        <h2>Cadastro de Produtos</h2>
        <button onClick={() => setShowForm(!showForm)} >
          <Icon path={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4.5v15m7.5-7.5h-15"}  />
          {showForm ? 'Cancelar' : 'Novo Produto'}
        </button>
      </div>

      {showForm && (
        <div >
          <form onSubmit={handleSubmit} >
            <div>
              <label >Nome do Produto</label>
              <input type="text" name="nome" value={formState.nome} onChange={handleChange} placeholder="Insira o nome do produto" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nome ? 'border-red-500' : ''}`} />
              {errors.nome && <p >{errors.nome}</p>}
            </div>
            <div>
              <label >Código de Barras</label>
              <input type="text" name="codigoBarras" value={formState.codigoBarras} onChange={handleChange} placeholder="Insira o código de barras" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.codigoBarras ? 'border-red-500' : ''}`} />
              {errors.codigoBarras && <p >{errors.codigoBarras}</p>}
            </div>
            <div >
              <label >Descrição</label>
              <textarea name="descricao" value={formState.descricao} onChange={handleChange} placeholder="Descreva brevemente o produto" rows="3" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.descricao ? 'border-red-500' : ''}`}></textarea>
              {errors.descricao && <p >{errors.descricao}</p>}
            </div>
            <div>
              <label >Quantidade em Estoque</label>
              <input type="number" name="quantidade" value={formState.quantidade} onChange={handleChange} placeholder="Quantidade disponível" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.quantidade ? 'border-red-500' : ''}`} />
              {errors.quantidade && <p >{errors.quantidade}</p>}
            </div>
            <div>
              <label >Categoria</label>
              <select name="categoria" value={formState.categoria} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.categoria ? 'border-red-500' : ''}`}>
                <option>Eletrônicos</option>
                <option>Alimentos</option>
                <option>Vestuário</option>
                <option>Outro</option>
              </select>
              {errors.categoria && <p >{errors.categoria}</p>}
            </div>
            <div>
              <label >Data de Validade (Opcional)</label>
              <input type="date" name="dataValidade" value={formState.dataValidade} onChange={handleChange}  />
            </div>
            <div>
              <label >Imagem do Produto (Opcional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div >
              <button type="submit" >Cadastrar</button>
            </div>
          </form>
        </div>
      )}

      <div >
        {produtos.map(p => (
          <div key={p.id} >
            <img src={p.imagem || `https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`} alt={p.nome}  onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`; }}/>
            <div >
              <h3 >{p.nome}</h3>
              <p >{p.codigoBarras}</p>
              <p >{p.descricao}</p>
              <div >
                <span >{p.categoria}</span>
                <span >{p.quantidade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// // página de associação de Fornecedor a Produto
const AssociacaoPage = ({ produtos, fornecedores, associacoes, reloadData }) => {
  const [selectedProdutoId, setSelectedProdutoId] = useState('');
  const [selectedFornecedorId, setSelectedFornecedorId] = useState('');

  const selectedProduto = produtos.find(p => p.id === parseInt(selectedProdutoId));
  const fornecedoresAssociadosIds = associacoes[selectedProdutoId] || [];
  const fornecedoresAssociados = fornecedores.filter(f => fornecedoresAssociadosIds.includes(f.id));

  const handleAssociar = async () => {
    if (!selectedProdutoId || !selectedFornecedorId) {
      alert('Por favor, selecione um produto e um fornecedor.');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/associacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoId: selectedProdutoId, fornecedorId: selectedFornecedorId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      alert(result.message);
      setSelectedFornecedorId('');
      reloadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDesassociar = async (fornecedorId) => {
    try {
      const response = await fetch(`${API_URL}/associacoes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoId: selectedProdutoId, fornecedorId: fornecedorId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      alert(result.message);
      reloadData();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div >
      <h2>Associação de Fornecedor a Produto</h2>
      
      <div >
        <label >Selecione um Produto</label>
        <select 
          value={selectedProdutoId} 
          onChange={(e) => { setSelectedProdutoId(e.target.value); setSelectedFornecedorId(''); }}
          
        >
          <option value="">-- Selecione --</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      {selectedProduto && (
        <div >
          <div >
            <h2 >Detalhes do Produto</h2>
            <img src={selectedProduto.imagem || `https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`} alt={selectedProduto.nome}  onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`; }}/>
            <p><strong>Nome:</strong> {selectedProduto.nome}</p>
            <p><strong>Cód. Barras:</strong> {selectedProduto.codigoBarras}</p>
            <p ><strong>Descrição:</strong> {selectedProduto.descricao}</p>
          </div>

          <div >
            <h2 >Associar Fornecedor</h2>
            <div >
              <div >
                <label >Selecione um Fornecedor</label>
                <select 
                  value={selectedFornecedorId} 
                  onChange={(e) => setSelectedFornecedorId(e.target.value)}
                  
                >
                  <option value="">-- Selecione --</option>
                  {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </div>
              <button onClick={handleAssociar} >Associar</button>
            </div>

            <h2 >Fornecedores Associados</h2>
            {fornecedoresAssociados.length > 0 ? (
              <ul >
                {fornecedoresAssociados.map(f => (
                  <li key={f.id} >
                    <div>
                      <p >{f.nome}</p>
                      <p >{f.cnpj}</p>
                    </div>
                    <button onClick={() => handleDesassociar(f.id)} >
                      <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p >Nenhum fornecedor associado a este produto.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default function App() {
  const [page, setPage] = useState('fornecedores');
  
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [associacoes, setAssociacoes] = useState({});
  const [loadingError, setLoadingError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [fornecedoresRes, produtosRes, associacoesRes] = await Promise.all([
        fetch(`${API_URL}/fornecedores`),
        fetch(`${API_URL}/produtos`),
        fetch(`${API_URL}/associacoes`)
      ]);

      if (!fornecedoresRes.ok || !produtosRes.ok || !associacoesRes.ok) {
        throw new Error('Falha ao carregar os dados do servidor. Verifique se o backend está rodando.');
      }

      const fornecedoresData = await fornecedoresRes.json();
      const produtosData = await produtosRes.json();
      const associacoesData = await associacoesRes.json();

      setFornecedores(fornecedoresData.data);
      setProdutos(produtosData.data);
      setAssociacoes(associacoesData.data);
      setLoadingError(''); // Limpa erros anteriores
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setLoadingError(error.message);
    }
  }, []);

  // useEffect para carregar os dados quando o componente App é montado.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderPage = () => {
    if (loadingError) {
      return <div>{loadingError}</div>;
    }
    
    switch (page) {
      case 'fornecedores':
        return <FornecedoresPage fornecedores={fornecedores} reloadData={fetchData} />;
      case 'produtos':
        return <ProdutosPage produtos={produtos} reloadData={fetchData} />;
      case 'associacao':
        return <AssociacaoPage produtos={produtos} fornecedores={fornecedores} associacoes={associacoes} reloadData={fetchData} />;
      default:
        return <FornecedoresPage fornecedores={fornecedores} reloadData={fetchData} />;
    }
  };

  return (
    <div>
      <Header setPage={setPage} />
      <main>
        {renderPage()}
      </main>
      <footer>
        <p>Projeto Integrador: Full Stack - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}