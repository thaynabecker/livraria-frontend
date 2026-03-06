import { ref } from 'vue'
import { defineStore } from 'pinia'

import AutorApi from '@/api/autor'

const autorApi = new AutorApi()

export const useAutorStore = defineStore('autor', () => {
  const autores = ref([
    {
      id: 1,
      descricao: 'Autor 1'
    },
    {
      id: 2,
      descricao: 'Autor 2'
    },
    {
      id: 3,
      descricao: 'Autor 3'
    }
  ])
  const meta = ref({
    page: 0,
    page_size: 0,
    total_pages: 0
  })

  async function getAutores(page = 1, search = '') {
    const data = await autorApi.buscarTodosOsAutores(page, search)
    autores.value = data.results
    meta.value.page = data.page
    meta.value.page_size = data.page_size
    meta.value.total_pages = data.total_pages
  }

  async function search(text) {
    console.log(text)
    await getAutores(1, text)
  }

  async function excluirAutor(id) {
    await autorApi.excluirAutor(id)
    const index = autores.value.findIndex((autor) => autor.id === id)
    autores.value.splice(index, 1)
  }

  async function salvarAutor(autor) {
    if (autor.id) {
      await autorApi.atualizarAutor(autor)
      const index = autores.value.findIndex((a) => a.id === autor.id)
      autores.value.splice(index, 1, autor)
    } else {
      const data = await autorApi.adicionarAutor(autor)
      autores.value.splice(0, 0, data)
    }
  }

  async function proximaPagina() {
    await getAutores(meta.value.page + 1)
  }

  async function paginaAnterior() {
    await getAutores(meta.value.page - 1)
  }

  return {
    autores,
    meta,
    getAutores,
    salvarAutor,
    excluirAutor,
    search,
    proximaPagina,
    paginaAnterior
  }
})
