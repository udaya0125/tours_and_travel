<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //
    protected $fillable = [
        'name',
    ];

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class);
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }

    public function faqs()
    {
        return $this->hasMany(Faq::class);
    }
}
