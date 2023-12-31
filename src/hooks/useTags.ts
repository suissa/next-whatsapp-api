import { useState, MutableRefObject, useRef, useEffect } from "react"
import Tag from "../core/Tag"
import TagRepository from "../core/TagRepository"
import useLayout from "./useLayout"

const API_URL = "http://localhost:9000/tags";

export default function useTags() {
  const [tag, setTag] = useState<Tag>(Tag.empty())
  const [tags, setTags] = useState<Tag[]>([])
  const { showForm, showTable, tableVisible } = useLayout()

  useEffect(listTags, [])

  function createTag() {
    setTag(Tag.empty())
    showForm()
  }

  function listTags() {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        console.log("listTags then", data)
        return setTags(data)
      })
  }

  function getTag(tag: Tag) {
    setTag(tag)
    showForm()
  }

  async function deleteTag(tag: Tag) {
    listTags()
  }

  async function saveTag(tag: Tag) {
    console.log("saveTag tag", tag)
    const tagStr = tag?._id
      ? JSON.stringify({
          _id: tag._id,
          name: tag.name,
          color: tag.color,
        })
      : JSON.stringify({
        name: tag.name,
        color: tag.color,
      })
    console.log("saveTag tagStr", tagStr)
    const response = tag?._id
      ? await fetch(`${API_URL}/${tag._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: tagStr
      })
      : await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: tagStr
      });
      // listTags()
      showTable()
    ;
  }

  return {
    tag,
    tags,
    createTag,
    saveTag,
    deleteTag,
    getTag,
    listTags,
    showTable,
    tableVisible
  }
}