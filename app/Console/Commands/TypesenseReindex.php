<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TypesenseService;

class TypesenseReindex extends Command
{
    protected $signature = 'typesense:reindex';
    protected $description = 'Reindex all reflections with vector embeddings';

    public function handle(TypesenseService $typesense)
    {
        $this->info('Reindexing all reflections...');

        try {
            $result = $typesense->reindexAll();

            $this->newLine();
            $this->info("Reindexing complete!");
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
            $this->error('Reindexing failed: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
