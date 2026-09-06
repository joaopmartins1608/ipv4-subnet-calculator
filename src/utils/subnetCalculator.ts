export interface SubnetResult {
  ip: string;
  cidr: number;
  netmask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
}

// Converte string IP ("192.168.1.1") para número inteiro de 32 bits
function ipToInt(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

// Converte inteiro de 32 bits de volta para formato "x.x.x.x"
function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join('.');
}

export function calculateSubnet(ipInput: string, cidrInput: number): SubnetResult | null {
  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  
  if (!ipRegex.test(ipInput) || cidrInput < 0 || cidrInput > 32) {
    return null;
  }

  const ipInt = ipToInt(ipInput);
  
  // Cria a máscara binária a partir do CIDR (ex: /24 gera 24 bits 1 seguidos de 8 bits 0)
  const maskInt = cidrInput === 0 ? 0 : (~0 << (32 - cidrInput)) >>> 0;
  
  // Endereço de rede: IP AND Máscara
  const networkInt = (ipInt & maskInt) >>> 0;
  
  // Endereço de broadcast: Rede OR Inverso da Máscara
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidrInput);
  const usableHosts = cidrInput >= 31 ? 0 : totalHosts - 2;

  const firstHostInt = cidrInput >= 31 ? networkInt : networkInt + 1;
  const lastHostInt = cidrInput >= 31 ? broadcastInt : broadcastInt - 1;

  return {
    ip: ipInput,
    cidr: cidrInput,
    netmask: intToIp(maskInt),
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstHost: intToIp(firstHostInt),
    lastHost: intToIp(lastHostInt),
    totalHosts,
    usableHosts,
  };
}