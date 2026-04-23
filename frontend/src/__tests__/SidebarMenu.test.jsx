import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SidebarMenu from '../components/SidebarMenu';

// Mock do useNavigate para não depender do Router real
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ─── Helpers ────────────────────────────────────────────────────────────────
const renderSidebar = (props = {}) => {
  const defaults = {
    isOpen: true,
    onClose: jest.fn(),
    ...props,
  };
  return render(
    <MemoryRouter>
      <SidebarMenu {...defaults} />
    </MemoryRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// ────────────────────────────────────────────────────────────────────────────
// Visibilidade
// ────────────────────────────────────────────────────────────────────────────
describe('SidebarMenu – visibilidade', () => {
  it('não deve renderizar nada quando isOpen=false', () => {
    renderSidebar({ isOpen: false });

    expect(screen.queryByText(/FlowTrack/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Histórico de Treinos/i)).not.toBeInTheDocument();
  });

  it('deve renderizar o menu quando isOpen=true', () => {
    renderSidebar({ isOpen: true });

    // "FlowTrack" está dividido em dois spans no h2, então buscamos por "Flow" e "Track" separadamente
    expect(screen.getByText(/Flow/)).toBeInTheDocument();
    expect(screen.getByText(/Track/)).toBeInTheDocument();
    expect(screen.getByText(/Histórico de Treinos/i)).toBeInTheDocument();
    expect(screen.getByText(/Dados Pessoais/i)).toBeInTheDocument();
    expect(screen.getByText(/Sair da conta/i)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Fechar
// ────────────────────────────────────────────────────────────────────────────
describe('SidebarMenu – fechar', () => {
  it('deve chamar onClose ao clicar no backdrop', () => {
    const onClose = jest.fn();
    const { container } = renderSidebar({ onClose });

    // O backdrop é o primeiro div fixo com zIndex 1000
    // Usamos querySelector buscando pelo zIndex no style
    const backdrop = container.querySelector('div[style*="z-index: 1000"]');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Navegação interna
// ────────────────────────────────────────────────────────────────────────────
describe('SidebarMenu – navegação para perfil', () => {
  it('deve exibir o formulário de perfil ao clicar em "Dados Pessoais"', () => {
    renderSidebar();

    fireEvent.click(screen.getByText(/Dados Pessoais/i));

    expect(screen.getByText(/Atualizar Dados/i)).toBeInTheDocument();
    // Verifica labels do formulário pelo texto
    expect(screen.getByText(/^Idade$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Sexo$/i)).toBeInTheDocument();
    expect(screen.getByText(/Peso Atual/i)).toBeInTheDocument();
    expect(screen.getByText(/Meta de Peso/i)).toBeInTheDocument();
    expect(screen.getByText(/Altura/i)).toBeInTheDocument();
  });

  it('deve exibir os inputs corretos no formulário de perfil', () => {
    renderSidebar();
    fireEvent.click(screen.getByText(/Dados Pessoais/i));

    // Os inputs de número (age, weight, targetWeight, height)
    const numberInputs = screen.getAllByRole('spinbutton'); // inputs type=number
    expect(numberInputs).toHaveLength(4); // age, weight, targetWeight, height

    // O select de gênero
    const genderSelect = screen.getByRole('combobox');
    expect(genderSelect).toBeInTheDocument();
  });

  it('deve voltar ao menu principal ao clicar em "Voltar"', () => {
    renderSidebar();

    // Vai para o perfil
    fireEvent.click(screen.getByText(/Dados Pessoais/i));
    expect(screen.getByText(/Atualizar Dados/i)).toBeInTheDocument();

    // Clica em voltar
    fireEvent.click(screen.getByText(/Voltar/i));

    // Deve retornar ao menu
    expect(screen.getByText(/Histórico de Treinos/i)).toBeInTheDocument();
    expect(screen.queryByText(/Atualizar Dados/i)).not.toBeInTheDocument();
  });

  it('deve navegar para /historico ao clicar em "Histórico de Treinos"', () => {
    const onClose = jest.fn();
    renderSidebar({ onClose });

    fireEvent.click(screen.getByText(/Histórico de Treinos/i));

    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/historico');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Carregamento de dados do localStorage
// ────────────────────────────────────────────────────────────────────────────
describe('SidebarMenu – localStorage', () => {
  it('deve pré-preencher o formulário com dados do localStorage', () => {
    const mockUser = {
      id: 'user-1',
      name: 'Nayara',
      email: 'nayara@test.com',
      age: 28,
      gender: 'Feminino',
      weight: 65.5,
      targetWeight: 60,
      height: 165,
    };
    localStorage.setItem('user', JSON.stringify(mockUser));

    renderSidebar();

    // Navega para o perfil
    fireEvent.click(screen.getByText(/Dados Pessoais/i));

    const numberInputs = screen.getAllByRole('spinbutton');
    // Ordem dos inputs: age, weight, targetWeight, height
    expect(numberInputs[0]).toHaveValue(28);     // age
    expect(numberInputs[1]).toHaveValue(65.5);   // weight
    expect(numberInputs[2]).toHaveValue(60);     // targetWeight
    expect(numberInputs[3]).toHaveValue(165);    // height

    // Gender select
    expect(screen.getByRole('combobox')).toHaveValue('Feminino');
  });
});
