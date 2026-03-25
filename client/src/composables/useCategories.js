import { ref } from 'vue'

export function useCategories() {
  const categories = ref([
    { 
      id: 1, 
      name: 'Smartphones & Tablets', 
      count: '120+ Produtos', 
      desc: 'Os últimos lançamentos em tecnologia móvel, com as melhores câmeras e desempenho absurdo para o seu dia a dia.' 
    },
    { 
      id: 2, 
      name: 'Notebooks', 
      count: '85+ Produtos', 
      desc: 'Máquinas de alta performance.' 
    },
    { 
      id: 3, 
      name: 'TVs & Áudio', 
      count: '64+ Produtos', 
      desc: 'Cinema imersivo em casa.' 
    }
  ])

  return {
    categories
  }
}
