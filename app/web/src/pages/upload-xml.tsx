import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, FileType, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getNfeLogs, uploadXmlFile, getAxiomErrors } from '@/api';
import type { NfeLogData, AxiomErrorData } from '@/types';
import { useEffect, useRef, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const columnsHistory: ColumnDef<NfeLogData>[] = [
  {
    accessorKey: 'nfeAccessKey',
    header: 'Chave NFe',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('nfeAccessKey')}
      </span>
    ),
  },
  {
    accessorKey: 'numNf',
    header: 'Número',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('numNf')}
      </span>
    ),
  },
  {
    accessorKey: 'serieNf',
    header: 'Série',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('serieNf')}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Data de Recebimento',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <span className="text-sm font-medium text-foreground">
          {date.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'processedAt',
    header: 'Status',
    cell: ({ row }) => {
      const processedAt = row.getValue('processedAt');
      return (
        <div className="flex items-center gap-2 text-sm font-medium">
          <div
            className={`w-2 h-2 rounded-full ${
              processedAt ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          {processedAt ? 'Processado' : 'Na Fila'}
        </div>
      );
    },
  },
  {
    accessorKey: 'message',
    header: 'Mensagem',
    cell: ({ row }) => {
      const msg = row.getValue('message') as string | undefined;
      const isError = msg && msg !== 'Importado com sucesso';
      return (
        <span
          className={`text-sm font-medium max-w-2xl block whitespace-normal break-words ${
            isError ? 'text-red-500' : 'text-emerald-500'
          }`}
        >
          {msg || 'Processando...'}
        </span>
      );
    },
  },
];

const columnsErrors: ColumnDef<AxiomErrorData>[] = [
  {
    accessorKey: 'nfeKey',
    header: 'Chave NFe',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('nfeKey')}
      </span>
    ),
  },
  {
    accessorKey: 'numnf',
    header: 'Número',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('numnf')}
      </span>
    ),
  },
  {
    accessorKey: 'serienf',
    header: 'Série',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('serienf')}
      </span>
    ),
  },
  {
    accessorKey: 'time',
    header: 'Data / Hora',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        {row.getValue('time')}
      </span>
    ),
  },
  {
    accessorKey: 'jobMessage',
    header: 'Mensagem de Erro',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-red-500 max-w-2xl block whitespace-normal break-words">
        {row.getValue('jobMessage')}
      </span>
    ),
  },
];

const UploadXmlPage = () => {
  const { page, q, numnf } = useSearch({ from: '/_app/upload-xml' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localSearch, setLocalSearch] = useState(q ?? numnf ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'errors'>('history');

  // Axiom Cursor Pagination State
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const isKey = localSearch.length === 44;
      const newQ = isKey && localSearch ? localSearch : undefined;
      const newNumnf = !isKey && localSearch ? localSearch : undefined;

      if (newQ !== q || newNumnf !== numnf) {
        navigate({
          to: '/upload-xml',
          search: {
            page: 1,
            q: newQ,
            numnf: newNumnf,
          },
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, navigate, q, numnf]);

  // Query 1: Prisma Logs (History)
  const { isFetching, data } = useQuery({
    queryKey: ['nfe-logs', page, q, numnf],
    queryFn: () => getNfeLogs(page, q, numnf),
    placeholderData: keepPreviousData,
  });

  // Query 2: Axiom Errors (first page only for merging)
  const { data: firstPageAxiomErrors } = useQuery({
    queryKey: ['axiom-errors-merge'],
    queryFn: () => getAxiomErrors(undefined),
  });

  // Query 3: Axiom Errors (for detailed tab with cursor pagination)
  const { isFetching: isFetchingAxiom, data: axiomData } = useQuery({
    queryKey: ['axiom-errors-tab', currentCursor],
    queryFn: () => getAxiomErrors(currentCursor),
    placeholderData: keepPreviousData,
  });

  // Merge Axiom errors into Prisma data for the first tab
  const mergedHistoryData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((item) => {
      const isProcessed = !!item.processedAt;
      let message = 'Importado com sucesso';

      if (!isProcessed) {
        const matchingError = firstPageAxiomErrors?.data?.find(
          (err) => err.nfeKey === item.nfeAccessKey,
        );

        if (matchingError) {
          message = matchingError.jobMessage;
        } else {
          message = 'Na Fila';
        }
      }

      return {
        ...item,
        message,
      };
    });
  }, [data?.data, firstPageAxiomErrors?.data]);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadXmlFile(file),
    onSuccess: (data) => {
      toast.success(data.message || 'XML enviado com sucesso!');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      queryClient.invalidateQueries({ queryKey: ['nfe-logs'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao enviar XML.');
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.xml')) {
        toast.error('Por favor, selecione um arquivo XML válido.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handlePreviousPage = () => {
    if (data?.meta.hasPrevious) {
      navigate({ to: '/upload-xml', search: { page: page - 1, q, numnf } });
    }
  };

  const handleNextPage = () => {
    if (data?.meta.hasNext) {
      navigate({ to: '/upload-xml', search: { page: page + 1, q, numnf } });
    }
  };

  const renderPageNumbers = () => {
    if (!data?.meta) return null;
    const { totalPages } = data.meta;
    const pages = [];

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (page <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (page >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          disabled={i === page}
          className={`w-9 ${
            i === page
              ? 'bg-violet-600 text-white border-transparent disabled:opacity-100 disabled:cursor-default'
              : ''
          }`}
          onClick={() =>
            navigate({ to: '/upload-xml', search: { page: i, q, numnf } })
          }
        >
          {i}
        </Button>,
      );
    }

    return <div className="flex items-center gap-1 mx-2">{pages}</div>;
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Importar XML
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground">
            Faça o upload de notas fiscais XML e acompanhe o processamento.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="mt-6 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card border-dashed">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="bg-violet-100 dark:bg-violet-900/30 p-4 rounded-full">
            <FileType className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg text-foreground">
              Selecione o arquivo XML da NFe
            </h3>
            <p className="text-sm text-muted-foreground">
              Apenas arquivos terminados em .xml são permitidos.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="file"
              accept=".xml"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <Button
              variant={selectedFile ? 'outline' : 'default'}
              className={
                !selectedFile
                  ? 'bg-violet-600 hover:bg-violet-700 text-white gap-2 px-6'
                  : 'gap-2 px-6'
              }
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFile ? 'Trocar Arquivo' : 'Escolher Arquivo'}
            </Button>

            {selectedFile && (
              <Button
                onClick={handleUploadClick}
                disabled={uploadMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 px-6"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                Enviar XML
              </Button>
            )}
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-4 py-2 rounded-lg mt-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Arquivo selecionado: <strong>{selectedFile.name}</strong> (
                {(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Table */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 border-b border-border pb-px mb-6">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Histórico de Importação
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'errors'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Erros Detalhados
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="space-y-4">
            <DataTable
              columns={columnsHistory}
              data={mergedHistoryData}
              searchPlaceholder="Buscar por Chave NFe ou Número..."
              exportFileName="logs-xml.csv"
              showPagination={false}
              searchValue={localSearch}
              onSearchChange={setLocalSearch}
            />

            {data && data.meta && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-muted-foreground">
                  Mostrando página {page} de {data.meta.totalPages} (
                  {data.meta.total} registros no total)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={!data.meta.hasPrevious}
                  >
                    Anterior
                  </Button>

                  {renderPageNumbers()}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!data.meta.hasNext}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                Erros Detalhados
                {isFetchingAxiom && (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </h2>
            </div>

            <DataTable
              columns={columnsErrors}
              data={axiomData?.data || []}
              exportFileName="erros-axiom.csv"
              showPagination={false}
            />

            {axiomData && axiomData.meta && (
              <div className="flex items-center justify-end mt-4 px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentCursor(axiomData.meta.maxCursor)}
                  disabled={!axiomData.meta.maxCursor}
                >
                  Carregar Mais Erros (Avançar Cursor)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UploadXmlPage;
