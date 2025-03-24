import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './TicketDetail.css';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeRef, setQrCodeRef] = useState(null);
  const [showQR, setShowQR] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockTicket = {
      id: ticketId,
      eventTitle: 'Summer Music Festival 2024',
      date: '2024-07-15',
      time: '18:00',
      location: 'Central Park, New York',
      ticketType: 'VIP Pass',
      price: '$199',
      status: 'Valid',
      purchaseDate: '2024-03-20',
      buyer: 'John Doe',
      qrCode: JSON.stringify({
        ticketId: ticketId,
        eventTitle: 'Summer Music Festival 2024',
        date: '2024-07-15',
        buyer: 'John Doe',
        timestamp: new Date().toISOString(),
        signature: 'EventGo-Verified' // This would be a secure signature in production
      })
    };
    setTicket(mockTicket);
    setLoading(false);
  }, [ticketId]);

  const handleDownloadQR = () => {
    if (qrCodeRef) {
      const svg = qrCodeRef.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `ticket-${ticketId}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = url;
    }
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  if (loading) return <div className="loading">Loading ticket details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ticket) return <div className="error">Ticket not found</div>;

  return (
    <div className="ticket-detail">
      <div className="ticket-header">
        <h1>Ticket Details</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back to Tickets
        </button>
      </div>

      <div className="ticket-content">
        <div className="ticket-info">
          <h2>{ticket.eventTitle}</h2>
          <div className="ticket-meta">
            <p><strong>Date:</strong> {ticket.date}</p>
            <p><strong>Time:</strong> {ticket.time}</p>
            <p><strong>Location:</strong> {ticket.location}</p>
            <p><strong>Ticket Type:</strong> {ticket.ticketType}</p>
            <p><strong>Price:</strong> {ticket.price}</p>
            <p><strong>Status:</strong> <span className={`status ${ticket.status.toLowerCase()}`}>{ticket.status}</span></p>
            <p><strong>Purchase Date:</strong> {ticket.purchaseDate}</p>
            <p><strong>Buyer:</strong> {ticket.buyer}</p>
          </div>
        </div>

        <div className="ticket-qr">
          <div className="qr-header">
            <h3>Ticket QR Code</h3>
            <button className="toggle-qr-btn" onClick={toggleQR}>
              {showQR ? 'Hide QR' : 'Show QR'}
            </button>
          </div>
          
          {showQR && (
            <>
              <div className="qr-container" ref={setQrCodeRef}>
                <div className="qr-overlay">
                  <QRCodeSVG
                    value={ticket.qrCode}
                    size={200}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    imageSettings={{
                      src: "https://eventgo.com/logo.png", // Replace with your logo
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="qr-border"></div>
              </div>
              
              <div className="qr-actions">
                <button className="download-qr-btn" onClick={handleDownloadQR}>
                  Download QR Code
                </button>
                <button className="share-qr-btn" onClick={() => window.print()}>
                  Print Ticket
                </button>
              </div>
            </>
          )}
          
          <div className="qr-info">
            <p className="qr-instructions">
              Show this QR code at the event entrance for verification
            </p>
            <div className="qr-security">
              <p>🔒 Secure QR Code</p>
              <p>⏰ Generated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail; 