<template>
  <div class="transfer">
    <a-transfer
      ref="transfer"
      class="tree-transfer"
      :data-source="dataSource"
      :target-keys="targetKeys"
      :render="item => item.title"
      :show-select-all="false"
      :list-style="{
        width: '300px',
        height: '300px'
      }"
      :locale="{
        itemUnit: '项', itemsUnit: '项',
      }"
      @change="onChange"
    >
      <template
        slot="children"
        slot-scope="{ props: { direction,filteredItems, selectedKeys }, on: { itemSelect } }"
      >
        <a-tree
          v-if="direction === 'left'"
          block-node
          checkable
          check-strictly
          :checked-keys="[...selectedKeys, ...targetKeys]"
          :tree-data="treeData"
          @check="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect);
            }
          "
          @select="
            (_, props) => {
              onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect);
            }
          "
        />
        <div v-if="direction === 'right'">
          <div
            v-for="(item) in filteredItems"
            :key="item.key"
          >
            <a-checkbox
              @change="rightChange(item.key)"
            >
              {{ item.title }}
            </a-checkbox>
          </div>
        </div>
      </template>

    </a-transfer>
  </div>
</template>
<script>
import { address } from './address'
// const treeData = [
//   { key: '0-0', title: '0-0' },
//   {
//     key: '0-1',
//     title: '0-1',
//     children: [
//       { key: '0-1-0', title: '0-1-0' },
//       { key: '0-1-1', title: '0-1-1' }
//     ]
//   },
//   { key: '0-2', title: '0-2' }
// ]
const treeData = address

const transferDataSource = []
// 遍历所有子节点到第一层级
function flatten(list = []) {
  list.forEach(item => {
    transferDataSource.push(item)
    flatten(item.children)
  })
}
flatten(JSON.parse(JSON.stringify(treeData)))

function isChecked(selectedKeys, eventKey) {
  return selectedKeys.indexOf(eventKey) !== -1
}

function handleTreeData(data, targetKeys = []) {
  data.forEach(item => {
    item['disabled'] = targetKeys.includes(item.key)
    if (item.children) {
      handleTreeData(item.children, targetKeys)
    }
  })
  return data
}

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      targetKeys: [],
      dataSource: transferDataSource
    }
  },
  computed: {
    treeData() {
      return handleTreeData(treeData, this.targetKeys)
    }
  },
  created() {
    this.targetKeys = this.value.length > 1 ? this.value.split(',') : this.value.split()
  },
  methods: {
    onChange(targetKeys) {
      console.log('Target Keys:', targetKeys)
      this.targetKeys = targetKeys
      this.$emit('input', this.targetKeys.length > 1 ? this.targetKeys.join(',') : this.targetKeys.join())
    },
    onChecked(_, e, checkedKeys, itemSelect) {
      const { eventKey } = e.node
      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    rightChange(val) {
      if (!this.$refs.transfer.targetSelectedKeys.includes(val)) {
        this.$refs.transfer.targetSelectedKeys.push(val)
      } else {
        const index = this.$refs.transfer.targetSelectedKeys.findIndex(item => {
          return item === val
        })
        this.$refs.transfer.targetSelectedKeys.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.transfer {
  width: 600px;
  margin: 100px auto;
}
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
>>> .ant-transfer-list-body{
  overflow: auto;
}
</style>
