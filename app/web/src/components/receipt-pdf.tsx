import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from '@react-pdf/renderer';
import { type SingleSaleData } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    position: 'relative',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoContainer: {
    width: 45,
    height: 45,
  },
  headerTitleBlock: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f5',
    padding: 6,
    marginBottom: 8,
    color: '#18181b',
    borderLeftWidth: 3,
    borderLeftColor: '#18181b',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 100,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#52525b',
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#27272a',
  },
  table: {
    width: '100%',
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d8',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#52525b',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 9,
    color: '#27272a',
  },
  colCode: { width: '15%' },
  colDesc: { width: '45%' },
  colUn: { width: '15%', textAlign: 'right' },
  colQtd: { width: '10%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#d4d4d8',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 20,
    color: '#52525b',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#18181b',
    width: '15%',
    textAlign: 'right',
  },
  footerBlock: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerInfo: {
    flex: 1,
  },
  signatureBlock: {
    width: 250,
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  textLine: {
    fontSize: 10,
    color: '#27272a',
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#a1a1aa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

interface ReceiptPDFProps {
  sale: SingleSaleData;
  saleId: string | number;
}

export const ReceiptPDF = ({ sale, saleId }: ReceiptPDFProps) => {
  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const totalSale =
    sale.saleItem?.reduce(
      (acc, item: any) => acc + Number(item.totalPrice),
      0,
    ) || 0;

  // Use the ID from the payload if available, fallback to the route param
  const displaySaleId = sale.id || saleId;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Svg viewBox="0 0 100 100">
                <Defs>
                  <LinearGradient id="violet-gradient" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#a78bfa" />
                    <Stop offset="50%" stopColor="#7c3aed" />
                    <Stop offset="100%" stopColor="#4c1d95" />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M 20 70 L 35 50 M 80 70 L 65 50 M 35 50 L 65 50"
                  stroke="url(#violet-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.4"
                />
                <Path
                  d="M 15 30 L 85 30 L 65 50 L 50 50 L 50 85"
                  stroke="url(#violet-gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx="15" cy="30" r="7" fill="#a78bfa" />
                <Circle cx="85" cy="30" r="7" fill="#a78bfa" />
                <Circle cx="50" cy="50" r="6" fill="#7c3aed" />
                <Circle cx="50" cy="85" r="8" fill="#4c1d95" />
              </Svg>
            </View>
            <View style={styles.headerTitleBlock}>
              <Text style={styles.headerTitle}>Comprovante de Venda</Text>
              <Text style={styles.headerSubtitle}>
                Pedido #{displaySaleId} • {formatDate(sale.date)}
              </Text>
            </View>
          </View>
        </View>

        {/* Informações da Empresa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da Empresa</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Empresa:</Text>
            <Text style={styles.value}>
              {sale.company?.fantasyName || 'Não informado'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>
              {sale.company?.address
                ? `${sale.company.address}, ${sale.company.addressNumber || 'S/N'}${
                    sale.company.neighborhood
                      ? ` - ${sale.company.neighborhood}`
                      : ''
                  }`
                : 'Não informado'}
            </Text>
          </View>
          {sale.company?.city && (
            <View style={styles.row}>
              <Text style={styles.label}>Cidade:</Text>
              <Text style={styles.value}>
                {sale.company.city.name} - {sale.company.city.state}
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Contato:</Text>
            <Text style={styles.value}>
              {sale.company?.phone || 'Não informado'}
              {sale.company?.email ? ` • ${sale.company.email}` : ''}
            </Text>
          </View>
        </View>

        {/* Informações do Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>
              {sale.customer?.name || 'Consumidor Final'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.value}>
              {sale.customer?.phone || 'Não informado'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>
              {sale.customer?.address
                ? `${sale.customer.address}, ${sale.customer.addressNumber || 'S/N'} ${
                    sale.customer.neighborhood
                      ? `- ${sale.customer.neighborhood}`
                      : ''
                  }`
                : 'Não informado'}
            </Text>
          </View>
          {sale.customer?.city && (
            <View style={styles.row}>
              <Text style={styles.label}>Cidade:</Text>
              <Text style={styles.value}>
                {sale.customer.city.name} - {sale.customer.city.state}
              </Text>
            </View>
          )}
        </View>

        {/* Tabela de Itens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens da Venda</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colCode]}>
                Código
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>
                Descrição
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colUn]}>
                V. Unit
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colQtd]}>Qtd</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>
                Total
              </Text>
            </View>

            {sale.saleItem && sale.saleItem.length > 0 ? (
              sale.saleItem.map((item: any, i: number) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.colCode]}>
                    {item.barcode}
                  </Text>
                  <Text style={[styles.tableCell, styles.colDesc]}>
                    {item.description || '--'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colUn]}>
                    {formatCurrency(item.salePrice)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colQtd]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.colTotal]}>
                    {formatCurrency(item.totalPrice)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Nenhum item registrado.</Text>
              </View>
            )}

            <View style={styles.totalsContainer}>
              <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalSale)}</Text>
            </View>
          </View>
        </View>

        {/* Rodapé e Assinatura */}
        <View style={styles.footerBlock}>
          <View style={styles.footerInfo}>
            <Text style={styles.textLine}>
              <Text style={{ fontWeight: 'bold' }}>Vendedor:</Text>{' '}
              {sale.user?.name || 'Não informado'}
            </Text>
            <Text style={[styles.textLine, { marginTop: 4 }]}>
              <Text style={{ fontWeight: 'bold' }}>Pagamento:</Text>{' '}
              {sale.paymentMethod?.description || 'Não informado'}
            </Text>
          </View>

          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              {sale.customer?.name || 'Consumidor Final'}
            </Text>
          </View>
        </View>

        {/* Texto de Fundo */}
        <Text style={styles.footerText}>
          Documento gerado pelo sistema Trace ERP •{' '}
          {new Date().toLocaleDateString('pt-BR')}
        </Text>
      </Page>
    </Document>
  );
};
