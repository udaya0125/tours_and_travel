<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    //
    protected $fillable = [
        'question',
        'answer',
        'category_id',
        'package_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
