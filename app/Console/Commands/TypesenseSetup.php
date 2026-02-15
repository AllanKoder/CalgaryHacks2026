<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TypesenseService;

class TypesenseSetup extends Command
{
    protected $signature = 'typesense:setup';
    protected $description = 'Create Typesense collection for vector search';

    public function handle(TypesenseService $typesense)
    {
        $this->info('Creating Typesense collection...');

        try {
            $result = $typesense->createCollection();
            $this->info('Collection created successfully!');
            $this->line(json_encode($result, JSON_PRETTY_PRINT));

            $this->newLine();
            $this->info('Run "php artisan typesense:reindex" to index existing reflections');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to create collection: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
