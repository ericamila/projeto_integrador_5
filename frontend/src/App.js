import React, { useState, useEffect, useCallback } from 'react';

// URL base da nossa API backend. Garanta que o servidor backend esteja rodando.
const API_URL = 'http://localhost:5000/api';

// Componente para ícones (sem alterações)
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Componente para o Cabeçalho (sem alterações)
const Header = ({ setPage }) => (
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Icon path="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" className="h-8 w-8 text-indigo-600" />
          <span className="ml-3 text-2xl font-bold text-gray-800">Gestão de Estoque</span>
        </div>
        <nav className="hidden md:flex space-x-4">
          <button onClick={() => setPage('fornecedores')} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">Fornecedores</button>
          <button onClick={() => setPage('produtos')} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">Produtos</button>
          <button onClick={() => setPage('associacao')} className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">Associação</button>
        </nav>
      </div>
    </div>
  </header>
);

// Componente para a página de Fornecedores
const FornecedoresPage = ({ fornecedores, reloadData }) => {
  const [formState, setFormState] = useState({ nome: '', cnpj: '', endereco: '', telefone: '', email: '', contato: '' });
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  // Validação do formulário no lado do cliente
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

  // Função para submeter o formulário para o backend
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
          // Se o backend retornar um erro (ex: CNPJ duplicado), exibe no formulário
          if (response.status === 409) {
            setErrors({ cnpj: result.error });
          } else {
            throw new Error(result.error || 'Falha ao cadastrar fornecedor.');
          }
        } else {
          alert(result.message);
          setFormState({ nome: '', cnpj: '', endereco: '', telefone: '', email: '', contato: '' });
          setShowForm(false);
          reloadData(); // Recarrega os dados de toda a aplicação
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cadastro de Fornecedores</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition flex items-center">
          <Icon path={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4.5v15m7.5-7.5h-15"} className="w-5 h-5 mr-2" />
          {showForm ? 'Cancelar' : 'Novo Fornecedor'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campos do formulário */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
              <input type="text" name="nome" value={formState.nome} onChange={handleChange} placeholder="Insira o nome da empresa" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nome ? 'border-red-500' : ''}`} />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input type="text" name="cnpj" value={formState.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.cnpj ? 'border-red-500' : ''}`} />
              {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <input type="text" name="endereco" value={formState.endereco} onChange={handleChange} placeholder="Insira o endereço completo da empresa" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.endereco ? 'border-red-500' : ''}`} />
              {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input type="text" name="telefone" value={formState.telefone} onChange={handleChange} placeholder="(00) 00000-0000" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.telefone ? 'border-red-500' : ''}`} />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input type="email" name="email" value={formState.email} onChange={handleChange} placeholder="exemplo@fornecedor.com" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Contato Principal</label>
              <input type="text" name="contato" value={formState.contato} onChange={handleChange} placeholder="Nome do contato principal" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.contato ? 'border-red-500' : ''}`} />
              {errors.contato && <p className="text-red-500 text-xs mt-1">{errors.contato}</p>}
            </div>
            <div className="md:col-span-2 text-right">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition">Cadastrar</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Fornecedores Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fornecedores.map(f => (
                <tr key={f.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.cnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.contato}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente para a página de Produtos
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cadastro de Produtos</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition flex items-center">
          <Icon path={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4.5v15m7.5-7.5h-15"} className="w-5 h-5 mr-2" />
          {showForm ? 'Cancelar' : 'Novo Produto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campos do formulário */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
              <input type="text" name="nome" value={formState.nome} onChange={handleChange} placeholder="Insira o nome do produto" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.nome ? 'border-red-500' : ''}`} />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Código de Barras</label>
              <input type="text" name="codigoBarras" value={formState.codigoBarras} onChange={handleChange} placeholder="Insira o código de barras" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.codigoBarras ? 'border-red-500' : ''}`} />
              {errors.codigoBarras && <p className="text-red-500 text-xs mt-1">{errors.codigoBarras}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea name="descricao" value={formState.descricao} onChange={handleChange} placeholder="Descreva brevemente o produto" rows="3" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.descricao ? 'border-red-500' : ''}`}></textarea>
              {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
              <input type="number" name="quantidade" value={formState.quantidade} onChange={handleChange} placeholder="Quantidade disponível" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.quantidade ? 'border-red-500' : ''}`} />
              {errors.quantidade && <p className="text-red-500 text-xs mt-1">{errors.quantidade}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <select name="categoria" value={formState.categoria} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.categoria ? 'border-red-500' : ''}`}>
                <option>Eletrônicos</option>
                <option>Alimentos</option>
                <option>Vestuário</option>
                <option>Outro</option>
              </select>
              {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Validade (Opcional)</label>
              <input type="date" name="dataValidade" value={formState.dataValidade} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagem do Produto (Opcional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>
            <div className="md:col-span-2 text-right">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition">Cadastrar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img src={p.imagem || `https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`} alt={p.nome} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`; }}/>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{p.nome}</h3>
              <p className="text-sm text-gray-500 mt-1">{p.codigoBarras}</p>
              <p className="text-sm text-gray-600 mt-2 h-10 overflow-hidden">{p.descricao}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{p.categoria}</span>
                <span className="text-lg font-bold text-gray-800">{p.quantidade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para a página de Associação
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
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Associação de Fornecedor a Produto</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecione um Produto</label>
        <select 
          value={selectedProdutoId} 
          onChange={(e) => { setSelectedProdutoId(e.target.value); setSelectedFornecedorId(''); }}
          className="mt-1 block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">-- Selecione --</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      {selectedProduto && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detalhes do Produto */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Detalhes do Produto</h2>
            <img src={selectedProduto.imagem || `https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`} alt={selectedProduto.nome} className="w-full h-48 object-cover rounded-md mb-4" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/400x400/e2e8f0/4a5568?text=Imagem+N/A`; }}/>
            <p><strong>Nome:</strong> {selectedProduto.nome}</p>
            <p><strong>Cód. Barras:</strong> {selectedProduto.codigoBarras}</p>
            <p className="mt-2"><strong>Descrição:</strong> {selectedProduto.descricao}</p>
          </div>

          {/* Associação e Lista */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Associar Fornecedor</h2>
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">Selecione um Fornecedor</label>
                <select 
                  value={selectedFornecedorId} 
                  onChange={(e) => setSelectedFornecedorId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">-- Selecione --</option>
                  {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </div>
              <button onClick={handleAssociar} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition h-fit">Associar</button>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-4">Fornecedores Associados</h2>
            {fornecedoresAssociados.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {fornecedoresAssociados.map(f => (
                  <li key={f.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{f.nome}</p>
                      <p className="text-sm text-gray-500">{f.cnpj}</p>
                    </div>
                    <button onClick={() => handleDesassociar(f.id)} className="text-red-500 hover:text-red-700 transition">
                      <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum fornecedor associado a este produto.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default function App() {
  const [page, setPage] = useState('fornecedores');
  
  // Os estados agora começam vazios, pois serão preenchidos pela API.
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [associacoes, setAssociacoes] = useState({});
  const [loadingError, setLoadingError] = useState('');

  // Função para buscar todos os dados do backend.
  // Usamos useCallback para evitar recriações desnecessárias da função.
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
      return <div className="text-center p-8 text-red-500 bg-red-100 rounded-lg m-8">{loadingError}</div>;
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
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header setPage={setPage} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Projeto Integrador: Full Stack - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
