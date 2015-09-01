<?php namespace Acme\Repositories\BaseRepository;

abstract class DbBaseRepository implements BaseRepository {

    public function getById($id)
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

    public function delete($id)
    {
        $this->model->destroy($id);
    }

    public function update($id, $input)
    {
        $val =  $this->model->find($id)->update($input);
        return $this->getById($input['id']);
    }

}
