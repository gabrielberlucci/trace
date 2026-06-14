import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center space-y-6 max-w-md px-4">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
          <AlertCircle className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold tracking-tight">
          Página não encontrada
        </h2>
        
        <p className="text-muted-foreground text-lg">
          Parece que você se perdeu no espaço. A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="pt-8">
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-200">
            <Link to="/">Voltar para o Início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
