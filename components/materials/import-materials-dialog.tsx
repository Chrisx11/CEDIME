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
import { importMaterialsFromExcel, ImportResult } from '@/lib/import-utils'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'

interface ImportMaterialsDialogProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete?: () => void
}

export function ImportMaterialsDialog({
  isOpen,
  onClose,
  onImportComplete,
}: ImportMaterialsDialogProps) {
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
      const importResult = await importMaterialsFromExcel(
        file,
        (progressValue, message) => {
          setProgress(progressValue)
          setProgressMessage(message)
        }
      )

      setResult(importResult)

      if (importResult.errors === 0 && importResult.notFound.length === 0) {
        toast({
          title: 'Importação concluída!',
          description: `${importResult.success} materiais atualizados com sucesso.`,
        })
        onImportComplete?.()
      } else {
        toast({
          title: 'Importação concluída com avisos',
          description: `${importResult.success} atualizados, ${importResult.errors} erros, ${importResult.notFound.length} não encontrados.`,
          variant: importResult.errors > 0 ? 'destructive' : 'default',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro na importação',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
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
              <DialogTitle className="text-xl">Importar Estoque do Excel</DialogTitle>
              <DialogDescription className="mt-1">
                Importe o estoque atual e preços dos materiais a partir de um arquivo Excel
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
                  <div className="text-sm text-muted-foreground">Atualizados</div>
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

              {result.createdUnits.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-sm font-medium mb-2">Unidades criadas:</div>
                  <div className="flex flex-wrap gap-2">
                    {result.createdUnits.map((unit) => (
                      <span
                        key={unit}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                      >
                        {unit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

