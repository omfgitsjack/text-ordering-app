<?php namespace Acme\Repositories\BaseRepository;

abstract class DbBaseRepository implements BaseRepository {

  public function getById(int $id)
	{
		return $this->model->find($id);
	}

	public function getAll()
	{
		return $this->model->all();
	}

	public function store($input)
	{
		return $this->model->create($input);
	}

	public function delete(int $id)
	{
		$this->model->destroy($id);
	}

  public function update(int $id, $input)
  {
    $this->model->find($id)->update($input);
  }

}
