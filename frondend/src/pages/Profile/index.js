import React, { useEffect } from 'react';
import {Link, useHistory} from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import './styles.css';
import api from '../../services/api';
import { useState } from 'react';


export default function Profile(){
const [incidents, setIncidents] = useState([]);

const history = useHistory();
const ongName = localStorage.getItem('ongName');
const ongId = localStorage.getItem('ongId');


useEffect(() => {
    api.get('profile', {
        headers: {
            Authorization: ongId
        }
    }).then(response => {
        setIncidents(response.data);
    })
}, [ongId]);


async function handleDeleteIncident(id){
    try{
        await api.delete(`incidents/${id}`, {
            headers: {
                Authorization: ongId
            }
        });    

        setIncidents(incidents.filter(incidents => incidents.id !== id))
        }
        catch{
        alert('Falha no engano ao deletar caso, tente novamente!');
    }
}

function handleLogout(){
    localStorage.clear();

    history.push('/');
}
    return (
        <div className="profile-container">
            <header>
            <img src={logoImg} alt="Be The Hero" />
    <span>Bem vinda, ${ongName}</span>

            <Link className="button" to="incidents/new">Cadastrar novo caso</Link>
            <button  onClick={handleLogout} type="button">
            <FiPower size={18} color="#E02041" />
            </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                   {incidents.map(incidents => (
                <li key={incidents.id}>
                        <strong>CASO:</strong>
                        <p>{incidents.title}</p>
    
                        <strong>DESCRIÇÃO:</strong>
                        <p>{incidents.description}</p>
    
                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pr-BR', {style: 'currency', currency: 'BRL'}).format(incidents.value)}</p>
    
                        <button type="button" onClick={() => handleDeleteIncident}>
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                </li>
                   ))}
            </ul>
        </div>
    );
}