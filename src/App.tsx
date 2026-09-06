import React, { useState } from 'react';
import { calculateSubnet, type SubnetResult } from './utils/subnetCalculator';

export default function App() {
  const [ip, setIp] = useState<string>('192.168.1.10');
  const [cidr, setCidr] = useState<number>(24);
  const [result, setResult] = useState<SubnetResult | null>(() => calculateSubnet('192.168.1.10', 24));
  const [error, setError] = useState<string>('');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateSubnet(ip.trim(), cidr);
    if (res) {
      setResult(res);
      setError('');
    } else {
      setError('Insira um endereço IPv4 válido (ex: 192.168.0.1) e máscara entre 0 e 32.');
      setResult(null);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2 style={{ marginBottom: '8px' }}>Calculadora de Sub-rede IPv4 & CIDR</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
        Utilitário para análise de redes, blocos CIDR e hosts utilizáveis.
      </p>

      <form onSubmit={handleCalculate} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 3 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>IP Base</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="192.168.1.1"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>CIDR (/)</label>
          <input
            type="number"
            min={0}
            max={32}
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button type="submit" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Calcular
          </button>
        </div>
      </form>

      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

      {result && (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', background: '#fafafa' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Resultado da Análise</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div><strong>Endereço de Rede:</strong> {result.networkAddress}/{result.cidr}</div>
            <div><strong>Máscara Decimal:</strong> {result.netmask}</div>
            <div><strong>Endereço de Broadcast:</strong> {result.broadcastAddress}</div>
            <div><strong>Hosts Utilizáveis:</strong> {result.usableHosts.toLocaleString()}</div>
            <div><strong>Primeiro Host Válido:</strong> {result.firstHost}</div>
            <div><strong>Último Host Válido:</strong> {result.lastHost}</div>
            <div><strong>Total de Endereços:</strong> {result.totalHosts.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}