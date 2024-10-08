import "./styles.scss";
import IUser from "../../typing/IUSER";
import { useEffect, useState } from "react";
import BASE_URL from "../../config/APIconfig";
import UserWrapper from "../userWrapper/UserWrapper";

function Wrapper() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const deleteUser = (id: number) => {
        fetch(`${BASE_URL}/User/DeleteUser/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir o usuário');
                }
                console.log(`Usuário com ID ${id} excluído com sucesso`);
                fetchUsers();
            })
            .catch(error => {
                console.error(`Erro ao excluir o usuário com id: ${id}`, error);
            });
    };

    const fetchUsers = () => {
        fetch(`${BASE_URL}/User/GetAllUsers`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar os usuários atualizados');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data.data);
            })
            .catch(error => {
                console.error('Erro ao buscar os usuários atualizados:', error);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (user: IUser | null) => {
        setModalIsOpen(true);
        setSelectedUser(user);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedUser(null);
        fetchUsers();
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="main-wrapper">
                <div className="wrapper-header">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Pesquisar por nome"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <button onClick={() => openModal(null)}>Adicionar Usuário Novo</button>
                    </div>
                </div>
                <div className="users-wrapper">
                    <ul className="users-list">
                        {filteredUsers.map(user => (
                            <li key={user.id}>
                                <div className="user-wrapper">
                                    <div className="user-info">
                                        <p>ID: {user.id}</p>
                                        <p>Nome: {user.name}</p>
                                        <p>Matrícula: #{user.register}</p>
                                    </div>
                                    <div className="user-ctas">
                                        <button onClick={() => openModal(user)}>Editar usuário</button>
                                        <button onClick={() => deleteUser(user.id)}>Excluir usuário</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {modalIsOpen && (
                <>
                    <div className="modal-overlay" onClick={closeModal} />
                    <UserWrapper selectedUser={selectedUser} closeModal={closeModal} />
                </>
            )}
        </>
    );
}

export default Wrapper;
