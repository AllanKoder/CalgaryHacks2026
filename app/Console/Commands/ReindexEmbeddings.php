<?php

namespace App\Console\Commands;

use App\Services\VectorSearchService;
use Illuminate\Console\Command;

class ReindexEmbeddings extends Command
{
    protected $signature = 'embeddings:reindex';

    protected $description = 'Reindex all event embeddings for semantic search';

    public function handle(VectorSearchService $vectorSearch)
    {
        $this->info('Starting embedding reindex...');

        $results = $vectorSearch->reindexAll();

        $this->newLine();
        $this->info("✓ Indexed: {$results['indexed']}");

        if ($results['failed'] > 0) {
            $this->warn("✗ Failed: {$results['failed']}");
        }

        $this->info("Total events: {$results['total']}");
        $this->newLine();
        $this->info('Reindexing complete!');

        return Command::SUCCESS;
    }
}
