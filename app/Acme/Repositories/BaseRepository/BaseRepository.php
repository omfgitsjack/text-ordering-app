<?php namespace Acme\Repositories\BaseRepository;

Interface BaseRepository {

    public function getById(int $id);

  	public function getAll();

  	public function store($input);

  	public function delete(int $id);

    public function update(int $id, $input);

}
