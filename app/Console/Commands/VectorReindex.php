<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\VectorSearchService;

class VectorReindex extends Command
{
    protected $signature = 'vector:reindex';
    protected $description = 'Reindex all reflections with vector embeddings via FastAPI';

    public function handle(VectorSearchService $vectorSearch)
    {
        $this->info('Reindexing all reflections...');
        $this->info('Note: Requires FastAPI to be running on ' . env('FASTAPI_URL', 'http://localhost:8001'));
        $this->newLine();

        try {
            $result = $vectorSearch->reindexAll();
            
            $this->newLine();
            $this->info("✅ Reindexing complete!");
            $this->table(
                ['Metric', 'Count'],
                [
                    ['Total', $result['total']],
                    ['Indexed', $result['indexed']],
                    ['Failed', $result['failed']],
                ]
            );
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Reindexing failed: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
