### FinAPI

### Requisitos Funcionais

- [x] Deve ser possível criar uma conta
- [x] Deve ser possível buscar o extrato bancário do cliente
- [x] Deve ser possível realizar um deposito
- [] Deve ser possível realizar um saque
- [] Deve ser possível buscar o extrato da conta do cliente por data
- [] Deve ser possível atualizar os dados da conta do cliente
- [] Deve ser possível obter dados da conta do cliente
- [] Deve ser possível deletar uma conta de cliente


### Regras de negócio

- [x] Não deve ser possível cadastrar uma conta com CPF já existente
- [x] Não deve ser possível buscar extrato em uma conta não existente ou de terceiros
- [x] Não deve ser possível fazer deposito em uma conta não existente
- [] Não deve ser possível fazer saques de uma conta não existente ou de terceiros
- [] Não deve ser possível excluir uma conta não existente ou de terceiros
- [] Não deve ser possível realizar saques quando o saldo for insuficiente