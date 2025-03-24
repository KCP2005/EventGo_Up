import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyTickets.css';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, valid, used, expired
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = () => {
      try {
        const storedTickets = localStorage.getItem('tickets');
        if (storedTickets) {
          setTickets(JSON.parse(storedTickets));
        }
      } catch (err) {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const handleViewTicket = (ticket) => {
    // Store the selected ticket in localStorage for the TicketDetail component
    localStorage.setItem('selectedTicket', JSON.stringify(ticket));
    navigate(`/tickets/${ticket.id}`);
  };

  if (loading) {
    return <div className="loading">Loading your tickets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-tickets">
      <div className="tickets-header">
        <h1>My Tickets</h1>
        <div className="tickets-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tickets</option>
            <option value="valid">Valid</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="no-tickets">
          <h2>No Tickets Found</h2>
          <p>You haven't purchased any tickets yet.</p>
          <button 
            className="browse-events-btn"
            onClick={() => navigate('/events')}
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.eventTitle}</h3>
                <span className={`status ${ticket.status}`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
              <div className="ticket-details">
                <p><strong>Date:</strong> {new Date(ticket.eventDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {ticket.eventTime}</p>
                <p><strong>Location:</strong> {ticket.eventLocation}</p>
                <p><strong>Quantity:</strong> {ticket.quantity}</p>
                <p><strong>Price:</strong> ${ticket.price.toFixed(2)}</p>
                <p><strong>Purchase Date:</strong> {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
              </div>
              <div className="ticket-actions">
                <button 
                  className="view-ticket-btn"
                  onClick={() => handleViewTicket(ticket)}
                >
                  View Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets; 