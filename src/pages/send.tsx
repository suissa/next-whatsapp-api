import { useEffect, useState } from "react";
import Button from "../components/Button";
import FormContact from "../components/FormContact";
import Layout from "../components/Layout";
import TableContacts from "../components/TableContacts";
import TableMessages from "../components/TableMessages";
import TableSendings from "../components/TableSendings";
import TableConnections from "../components/Table";
import Menu from '../components/Menu';
import useContacts from "../hooks/useContacts";
import useMessages from "../hooks/useMessages";
import useConnections from "../hooks/useConnections";
import useSend from "../hooks/useSend";
import useLayout from "../hooks/useLayout";
import constructWithOptions from "styled-components/dist/constructors/constructWithOptions";

export default function Home() {
  // const [list, setList] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState();
  const [selectedConnection, setSelectedConnection] = useState();
  const [loading, setLoading] = useState(false);

  const {
    contact,
    contacts,
    createContact,
    saveContact,
    deleteContact,
    getContact,
    listContacts,
    showTable,
    tableVisible
  } = useContacts()

  const {
    message,
    messages,
    createMessage,
    saveMessage,
    deleteMessage,
    getMessage,
    listMessages,
  } = useMessages()

  const {
    connection,
    connections,
    createConnection,
    saveConnection,
    deleteConnection,
    getConnection,
    listConnections,
  } = useConnections()

  const {
    sendMessage,
    list,
    setList
  } = useSend()

  const handleSendMessage = async () => {
    setLoading(true);

    if (selectedMessage && selectedConnection) {
      try {
        // Use selectedContacts diretamente
        if (selectedContacts.length > 0) {  
          console.log('selectedContacts:', selectedContacts);
          // const newContacts = selectedContacts.filter(contact => 
          //   !list.some(item => item.contact === contact)
          // );
          // console.log('newContacts:', newContacts);
          const newEntries = selectedContacts.map(contact => ({
            connection: selectedConnection,
            contact: contact,
            message: selectedMessage
          }));

          console.log('list:', list);
          console.log('newEntries:', newEntries);
          setList([...list, ...newEntries]);

          console.log('sendingsList:', selectedMessage);
          await sendMessage(selectedMessage, selectedContacts, selectedConnection);
        } else {
          // Trate o caso em que nenhum contato foi selecionado
          alert("Nenhum contato selecionado.");
        }
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Parâmetros incompletos para o envio.");
      setLoading(false);
    }
  };


  const handleContactsSelectionChange = (selectedIds) => {
    setSelectedContacts(selectedIds);
  };

  const handleMessagesSelectionChange = (selectedId) => {
    setSelectedMessage(selectedId);
  };

  const handleConnectionsSelectionChange = (selectedId) => {
    console.log("handleConnectionsSelectionChange selectedId", selectedId)
    setSelectedConnection(selectedId);
  };

  useEffect(() => {
    if (list) {
      console.log('list if:', list);
    } else {
      console.log('list else:', list);
    }
  }, [list]); // Dependência do useEffect

  useEffect(() => {
    if (loading) {
      console.log('loading if:', loading);
    } else {
      console.log('loading else:', loading);
    }
  }, [loading]); // Dependência do useEffect

  const Modal = ({ onClose, onConfirm, contact }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
        <div className="bg-white p-4 rounded">
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded mr-2"
              onClick={onConfirm}
            >
              Excluir
            </button>
            <button
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white
              px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Menu />
      <div className={`flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white`}>
        <Layout title="Envios" width="w-3/3">
          <div>
            <div className="flex justify-end">
              <Button
                color="green"
                className="mb-4"
                onClick={handleSendMessage}
                >
                {loading ? 'Enviando...' : 'Novo Envio'}
              </Button>
            </div>
            <div className="flex h-80">
              <div className="flex-1 overflow-auto">
                <TableConnections
                  connections={connections}
                  showCheckboxes={true}
                  showActions={false}
                  hideCertainColumns={true}
                  filterActiveInstances={true}
                  onSelectionChange={handleConnectionsSelectionChange}
                />
              </div>
              <div className="flex-1 overflow-auto">
                <TableContacts
                  contacts={contacts}
                  contactSelected={getContact}
                  contactDeleted={deleteContact}
                  contactModified={saveContact}
                  showCheckboxes={true}
                  canceled={showTable}
                  showActions={false}
                  onSelectionChange={handleContactsSelectionChange}
                />
              </div>
            </div>
            <div className="flex h-80">
              <div className="flex-1 overflow-auto">
                <TableMessages
                  messages={messages}
                  messageSelected={getMessage}
                  messageDeleted={deleteMessage}
                  messageModified={saveMessage}
                  canceled={showTable}
                  showCheckboxes={true}
                  showActions={false}
                  onSelectionChange={handleMessagesSelectionChange}
                />
              </div>
              <div className="flex-1 overflow-auto">
                <TableSendings
                  list={list}
                />
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  )
}
