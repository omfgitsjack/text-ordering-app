<?php namespace Acme\Repositories\BaseRepository;

Interface BaseRepository {

    public function getById($id);

  	public function getAll();

  	public function store($input);

  	public function delete($id);

    public function update($id, $input);

}
