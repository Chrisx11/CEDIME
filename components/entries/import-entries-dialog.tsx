'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { importEntriesFromExcel, ImportResult } from '@/lib/import-utils'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

interface ImportEntriesDialogProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete?: () => void
}

export function ImportEntriesDialog({
  isOpen,
  onClose,
  onImportComplete,
}: ImportEntriesDialogProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar extensão do arquivo
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione um arquivo Excel (.xlsx ou .xls)',
        variant: 'destructive',
      })
      return
    }

    setIsImporting(true)
    setProgress(0)
    setProgressMessage('')
    setResult(null)

    try {
      const importResult = await importEntriesFromExcel(
        file,
        (progressValue, message) => {
          setProgress(progressValue)
          setProgressMessage(message)
        }
      )

      console.log('📦 Resultado da importação recebido:', importResult)
      setResult(importResult)

      // Sempre chamar refresh se houver pelo menos uma entrada criada
      if (importResult.success > 0) {
        console.log('✅ Chamando onImportComplete com', importResult.success, 'entradas criadas')
        // Aguardar um pouco para garantir que o banco processou
        setTimeout(async () => {
          console.log('🔄 Executando onImportComplete agora')
          try {
            if (onImportComplete) {
              await onImportComplete()
              console.log('✅ onImportComplete executado com sucesso')
            } else {
              console.error('❌ onImportComplete não está definido!')
            }
          } catch (error) {
            console.error('❌ Erro ao executar onImportComplete:', error)
          }
        }, 1500)
      } else {
        console.log('⚠️ Nenhuma entrada criada (success = 0)')
      }

      // Sempre mostrar toast com o resultado
      if (importResult.success > 0) {
        if (importResult.errors === 0 && importResult.notFound.length === 0) {
          toast({
            title: '✅ Importação concluída!',
            description: `${importResult.success} entradas criadas com sucesso.`,
          })
        } else {
          toast({
            title: '⚠️ Importação concluída com avisos',
            description: `${importResult.success} criadas, ${importResult.errors} erros, ${importResult.notFound.length} materiais não encontrados.`,
            variant: importResult.errors > 0 ? 'destructive' : 'default',
          })
        }
      } else {
        toast({
          title: '❌ Nenhuma entrada criada',
          description: `${importResult.errors} erros, ${importResult.notFound.length} materiais não encontrados.`,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro na importação:', error)
      toast({
        title: 'Erro na importação',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
      setResult({
        success: 0,
        errors: 1,
        notFound: [],
        createdUnits: [],
        errorsList: [{ material: 'Erro geral', error: error instanceof Error ? error.message : 'Erro desconhecido' }]
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    if (!isImporting) {
      setResult(null)
      setProgress(0)
      setProgressMessage('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Importar Entradas do Excel</DialogTitle>
              <DialogDescription className="mt-1">
                Importe entradas a partir de um arquivo Excel. As entradas serão criadas automaticamente.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!result && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecione o arquivo Excel</label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={isImporting}
                  className="hidden"
                  id="excel-file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="flex-1"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {isImporting ? 'Importando...' : 'Selecionar Arquivo'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Colunas esperadas: Material, Quantidade, Preço Unitário, Fornecedor (opcional), Responsável, Data de Entrada
              </p>
            </div>
          )}

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{progressMessage}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.success}
                  </div>
                  <div className="text-sm text-muted-foreground">Criadas</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 mb-2" />
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {result.errors}
                  </div>
                  <div className="text-sm text-muted-foreground">Erros</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mb-2" />
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {result.notFound.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Não Encontrados</div>
                </div>
              </div>

              {result.notFound.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="text-sm font-medium mb-2">Materiais não encontrados:</div>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-xs space-y-1">
                      {result.notFound.slice(0, 10).map((name, index) => (
                        <li key={index}>• {name}</li>
                      ))}
                      {result.notFound.length > 10 && (
                        <li className="text-muted-foreground">
                          ... e mais {result.notFound.length - 10} materiais
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {result.errorsList.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-sm font-medium mb-2">Erros encontrados:</div>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-xs space-y-1">
                      {result.errorsList.slice(0, 5).map((error, index) => (
                        <li key={index}>
                          <span className="font-medium">{error.material}:</span>{' '}
                          {error.error}
                        </li>
                      ))}
                      {result.errorsList.length > 5 && (
                        <li className="text-muted-foreground">
                          ... e mais {result.errorsList.length - 5} erros
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isImporting}
          >
            {result ? 'Fechar' : 'Cancelar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

