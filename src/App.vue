<script setup lang="ts">
import { Ref, ref } from 'vue'
import api from './http'
import ErrorMessage from './components/ErrorMessage.vue';
import axios from 'axios';
import { vMaska } from "maska"

type UserType = {
    email: string
    number: string
}

const email: Ref<null | string> = ref(null)
const num: Ref<null | string> = ref(null)
const data: Ref<UserType[]> = ref([])
const errorMessage: Ref<string> = ref('') 
const errorColor: Ref<'rgb(255, 82, 82)' | 'green'> = ref('rgb(255, 82, 82)')
const loading: Ref<boolean> = ref(false)
 
let controller = new AbortController()
async function onClickForm(){
    try {

        if (!email.value) return errorMessage.value = 'front: email cant be empty'

        if (loading.value) {
            controller.abort()
            controller = new AbortController()
        }

        loading.value = true
        data.value = []
        data.value = (await api.get<UserType[]>(`/data?email=${email.value ?? ''}&num=${num.value ? num.value.replaceAll('-', '') : ''}`, {
            signal: controller.signal
        })).data
        loading.value = false
    } catch (error: any) {
        console.log(error)

        if (axios.isCancel(error)) {
            errorColor.value = 'green'
            errorMessage.value = 'Реквест перезапущен'
        } else {
            errorMessage.value = error?.response?.data?.message ?? 'Неизвестная ошибка'
            loading.value = false
        }


    }
}

function onRemoveMessage() {
    errorMessage.value = ''
    errorColor.value = 'rgb(255, 82, 82)'
}

</script>


<template>
<div class="lay">
    <Transition name="fade">
        <ErrorMessage v-if="errorMessage" @removeMessage="onRemoveMessage" :errorColor="errorColor" :errorMessage="errorMessage"/>
    </Transition>
    <div class="labels">
        <form @submit.prevent>
            <label>
                <div>Email</div>
                <input
                :value="email"
                @input="(event) => email = (event?.target as HTMLInputElement).value"
                type="text">
            </label>
            <label>
                <div>Number</div>
                <input 
                v-maska data-maska="##-##-##-##-##-##-##"
                :value="num"
                @input="event => num = (event?.target as HTMLInputElement).value"
                type="text">
            </label>
            
            <button 
            @click="onClickForm"
            class="submit-btn">
              FIND!
            </button>
        </form>
    </div>
    <div class="result">
        <div v-if="loading" class="loading">
            Loading...
        </div>
        <div v-if="!loading && !data.length" class="loading">
            No Data
        </div>
        <div class="item" v-for="item in data">
            <div>
                {{item.email}}
            </div>
            <div>
                {{item.number}}
            </div>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
   .lay {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #0b0736 0%,#603a66 100%);

        .result {
          max-width: 400px;
          width: 100%;
          height: 200px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          .loading {
            color: rgb(175, 169, 182);
            display: flex;
            position: absolute;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
          &::-webkit-scrollbar {
            width: 10px;
          }
          &::-webkit-scrollbar-track {
            background-color: rgba(175, 169, 182, .5);
          }
          &::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 6px rgba(175, 169, 182, 0.3);
          }

          .item {
            padding: 2px;
            border: 1px solid rgb(175, 169, 182);
            color: rgb(175, 169, 182);
            &:not(&:first-child) {
                margin-block-start: 1px;
            }
          }
        }

        .labels {
            // margin-block-start: 25%;
            max-width: 400px;
            width: 100%;
            padding: 20px;
            flex-grow: 0;
            flex-shrink: 1;
            

            form {
                margin-block-start: 40px;
                label {
                    font-size: 15px;
                    color: rgb(175, 169, 182);
                    display: block;
                    &:not(:first-child) {
                        margin-block-start: 20px;
                    }
                    input {
                        margin-block-start: 10px;
                        padding: 10px 10px 10px 15px;
                        border-radius: 25px;
                        box-shadow: inset 0 0 0 50px rgb(97, 94, 100);
                        -webkit-text-fill-color: #fff;
                    }
                }

                .submit-btn {
                    background: rgb(202, 202, 0);
                    border-radius: 20px;
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    margin-block-start: 15px;
                    color: #FFFFFF;
                    font-weight: 700;
                    transition: .3s;
                    cursor: pointer;
                    &:hover {
                        background: rgb(146, 146, 2);
                    }
                    &.disabled {
                        pointer-events: none;
                        opacity: .7;
                    }
                }
            }

            .checkbox-wrap {
                margin-block-start: 15px;
                display: flex;
                // justify-content: center;
                align-items: center;
                .fake-checkbox {
                    width: 20px;
                    height: 20px;
                    background: rgb(202, 202, 0);
                    border-radius: 5px;
                    cursor: pointer;
                    margin-inline-end: 10px;
                    position: relative;
                    overflow: hidden;

                    &::after, &::before {
                        opacity: 0;
                        transition: .3s;
                        content: "";
                    }

                    &.active {
                        
                        &::before {
                            position: absolute;
                            opacity: 1;
                            left: 0;
                            top: 50%;
                            height: 30%;
                            width: 3px;
                            background-color: #000000;

                            transform: translateX(6px) rotate(-45deg);
                            transform-origin: left bottom;        
                        }
                        &::after {
                            position: absolute;
                            opacity: 1;
                            left: 0;
                            bottom: 15%;
                            height: 3px;
                            width: 80%;
                            background-color: #000000;

                            transform: translateX(8px) rotate(-45deg);
                            transform-origin: left bottom;      
                        }
                    }
                }
                
                span {
                        line-height: 0;
                        font-size: 12px;
                        color: #FFFFFF;
                    }
            }

            .line {
                width: 80%;
                height: 2px;
                background: rgb(175, 169, 182);
                margin-block-start: 20px;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
            }

            .forgot {
                margin-block-start: 15px;
                text-align: center;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                cursor: pointer;
                color: rgb(175, 169, 182);
            }

        }
    }
</style>
