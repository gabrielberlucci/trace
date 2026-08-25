import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ServiceOrderData } from '@/types';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20, // Reduced from 30
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 10, // Reduced from 20
    alignItems: 'center',
  },
  title: {
    fontSize: 14, // Reduced from 16
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  companyName: {
    fontSize: 12, // Reduced from 14
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  companySub: {
    fontSize: 10, // Reduced from 12
    marginBottom: 5,
  },
  companyText: {
    fontSize: 9, // Reduced from 10
    marginBottom: 1, // Reduced from 2
    color: '#333333',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
    marginVertical: 5, // Reduced from 10
    width: '100%',
  },
  clientBox: {
    marginBottom: 10, // Reduced from 15
  },
  clientText: {
    fontSize: 9, // Reduced from 10
    marginBottom: 2, // Reduced from 4
  },
  table: {
    width: '100%',
    marginTop: 5, // Reduced from 10
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
    paddingBottom: 2, // Reduced from 5
    marginBottom: 2, // Reduced from 5
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 2, // Reduced from 4
  },
  tableColDate: { width: '15%' },
  tableColService: { width: '45%' },
  tableColHours: { width: '10%', textAlign: 'center' },
  tableColRate: { width: '15%', textAlign: 'right' },
  tableColTotal: { width: '15%', textAlign: 'right' },

  tableHeaderText: {
    fontSize: 9, // Reduced from 10
    fontFamily: 'Helvetica-Bold',
  },
  tableCell: {
    fontSize: 9, // Reduced from 10
  },
  totalSection: {
    marginTop: 10, // Reduced from 20
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalText: {
    fontSize: 11, // Reduced from 12
    fontFamily: 'Helvetica-Bold',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 11, // Reduced from 12
    fontFamily: 'Helvetica-Bold',
    width: '15%',
    textAlign: 'right',
  },
  footer: {
    marginTop: 30, // Reduced from 60
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '40%',
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9, // Reduced from 10
  },
  mechanicBox: {
    width: '40%',
  },
  mechanicText: {
    fontSize: 9, // Reduced from 10
  },
  via: {
    // removed flex 1 so it doesn't force a full page height
  },
  cutLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'dashed',
    marginVertical: 10, // Reduced from 20
    width: '100%',
  },
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface Props {
  data: ServiceOrderData;
}

const ServiceOrderVia = ({
  data,
  totalOs,
  formattedDate,
}: {
  data: ServiceOrderData;
  totalOs: number;
  formattedDate: string;
}) => {
  const { company, customer, serviceOrderItems } = data;

  return (
    <View style={styles.via}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>ORDEM DE SERVIÇO</Text>
        <Text style={styles.companyName}>
          {company.fantasyName || company.name}
        </Text>
        <Text style={styles.companyText}>
          Endereço: {company.address}, {company.addressNumber}{' '}
          {company.neighborhood ? `- Bairro: ${company.neighborhood}` : ''}{' '}
          {company.complement ? `- ${company.complement}` : ''}
        </Text>
        <Text style={styles.companyText}>Cidade: {company.city?.name}</Text>
        <Text style={styles.companyText}>Cel: {company.phone || 'N/A'}</Text>
      </View>

      <View style={styles.divider} />

      {/* CLIENT INFO */}
      <View style={styles.clientBox}>
        <Text style={styles.clientText}>Cliente: {customer.name}</Text>
        <Text style={styles.clientText}>
          Endereço: {customer.address}, {customer.addressNumber}{' '}
          {customer.neighborhood ? `- Bairro: ${customer.neighborhood}` : ''}{' '}
          {customer.complement ? `- ${customer.complement}` : ''}
        </Text>
        <Text style={styles.clientText}>Cel: {customer.phone || 'N/A'}</Text>
        <Text style={styles.clientText}>Data: {formattedDate}</Text>
      </View>

      <View style={styles.divider} />

      {/* ITEMS TABLE */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={styles.tableColDate}>
            <Text style={styles.tableHeaderText}>Data</Text>
          </View>
          <View style={styles.tableColService}>
            <Text style={styles.tableHeaderText}>Serviço</Text>
          </View>
          <View style={styles.tableColHours}>
            <Text style={styles.tableHeaderText}>Horas</Text>
          </View>
          <View style={styles.tableColRate}>
            <Text style={styles.tableHeaderText}>Valor hora</Text>
          </View>
          <View style={styles.tableColTotal}>
            <Text style={styles.tableHeaderText}>Total</Text>
          </View>
        </View>

        {/* Table Rows */}
        {serviceOrderItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableColDate}>
              <Text style={styles.tableCell}>
                {format(new Date(item.date), 'dd/MM')}
              </Text>
            </View>
            <View style={styles.tableColService}>
              <Text style={styles.tableCell}>{item.description}</Text>
            </View>
            <View style={styles.tableColHours}>
              <Text style={styles.tableCell}>{item.hours.toString()}</Text>
            </View>
            <View style={styles.tableColRate}>
              <Text style={styles.tableCell}>
                {formatCurrency(item.hourlyRate).replace('R$', '').trim()}
              </Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text style={styles.tableCell}>
                {formatCurrency(item.totalPrice).replace('R$', '').trim()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* TOTAL */}
      <View style={styles.totalSection}>
        <Text style={styles.totalText}>Total R$</Text>
        <Text style={styles.totalValue}>
          {formatCurrency(totalOs).replace('R$', '').trim()}
        </Text>
      </View>

      {/* FOOTER / SIGNATURE */}
      <View style={styles.footer}>
        <View style={styles.mechanicBox}>
          <Text style={styles.mechanicText}>Mecânico: Rogério</Text>
        </View>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Assinatura Cliente</Text>
        </View>
      </View>
    </View>
  );
};

export const ServiceOrderPdf = ({ data }: Props) => {
  const { date, serviceOrderItems } = data;

  const formattedDate = format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  const totalOs = serviceOrderItems.reduce(
    (acc, item) => acc + Number(item.totalPrice),
    0,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ServiceOrderVia
          data={data}
          totalOs={totalOs}
          formattedDate={formattedDate}
        />
        <View style={styles.cutLine} />
        <ServiceOrderVia
          data={data}
          totalOs={totalOs}
          formattedDate={formattedDate}
        />
      </Page>
    </Document>
  );
};
//
